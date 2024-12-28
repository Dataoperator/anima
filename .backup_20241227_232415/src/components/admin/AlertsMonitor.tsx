import React, { useState, useEffect } from 'react';
import { AlertLevel, Alert, AlertAction } from '@/types/alerts';
import { useAuth } from '@/contexts/AuthContext';
import { AlertsMonitor as AlertsService } from '@/analytics/AlertsMonitor';

interface AlertsMonitorProps {
  animaId: string;
}

interface AlertFilters {
  level: AlertLevel | null;
  since: Date | null;
  until: Date | null;
}

export const AlertsMonitor: React.FC<AlertsMonitorProps> = ({ animaId }) => {
  const { actor } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState<AlertFilters>({
    level: null,
    since: null,
    until: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const alertsService = new AlertsService();

  useEffect(() => {
    fetchAlerts();
  }, [animaId, actor]);

  const fetchAlerts = async () => {
    if (!actor) return;

    try {
      setLoading(true);
      setError(null);

      // Get alerts from canister
      const response = await actor.get_system_alerts();
      const systemAlerts = response.map(alert => ({
        ...alert,
        timestamp: Number(alert.timestamp),
        acknowledged: false,
        resolved: false
      }));

      // Process alerts through our service
      systemAlerts.forEach(alert => alertsService.addAlert(alert));
      
      // Apply filters
      const filtered = alertsService.getAlerts({
        type: filters.level?.toLowerCase() as 'error' | 'warning' | 'info' | undefined,
        since: filters.since?.getTime(),
        acknowledged: false
      });

      setAlerts(filtered);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (alertId: string, action: AlertAction) => {
    if (!actor) return;

    try {
      setLoading(true);
      await actor.handle_alert_action({
        alert_id: alertId,
        action: {
          type: action.type,
          params: action.params
        }
      });
      
      // Mark alert as resolved in local service
      alertsService.resolveAlert(alertId, 'user');
      
      // Refresh alerts
      await fetchAlerts();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (level: AlertLevel): string => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'WARNING':
        return 'bg-yellow-500';
      case 'INFO':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const updateFilters = (newFilters: Partial<AlertFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      fetchAlerts();
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">System Alerts</h2>
        <div className="flex space-x-2">
          <select
            className="rounded-md border-gray-300"
            value={filters.level || ''}
            onChange={e => updateFilters({ 
              level: e.target.value as AlertLevel || null 
            })}
          >
            <option value="">All Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
          
          <input
            type="datetime-local"
            className="rounded-md border-gray-300"
            value={filters.since?.toISOString().slice(0, 16) || ''}
            onChange={e => updateFilters({ 
              since: e.target.value ? new Date(e.target.value) : null 
            })}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-2">
        {loading ? (
          <div className="text-center text-gray-500 py-4">
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No alerts found
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-md ${getAlertColor(alert.severity)} bg-opacity-10`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-block px-2 py-1 rounded text-sm ${
                    getAlertColor(alert.severity)
                  } text-white mb-2`}>
                    {alert.severity}
                  </span>
                  <p className="text-sm">{alert.message}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              
              {alert.metadata && (
                <div className="mt-2 text-sm text-gray-600">
                  {Object.entries(alert.metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              )}
              
              {!alert.resolved && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleAction(alert.id, { type: 'acknowledge' })}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Acknowledge
                  </button>
                  {alert.severity === 'CRITICAL' && (
                    <button
                      onClick={() => handleAction(alert.id, { type: 'escalate' })}
                      className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                    >
                      Escalate
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="px-4 py-2 bg-quantum-purple hover:bg-quantum-purple/90 text-white rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Alerts'}
        </button>
        <span className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </span>
      </div>
    </div>
  );
};