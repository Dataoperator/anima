import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  Bell, 
  Info, 
  Check,
  Filter,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert as AlertType, AlertSeverity, AlertCategory } from '@/analytics/AlertsMonitor';

interface AlertsPanelProps {
  alerts: AlertType[];
  onResolve: (id: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  alerts,
  onResolve 
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'All'>('All');
  const [showResolved, setShowResolved] = useState(false);

  const getSeverityColor = (severity: AlertSeverity): string => {
    switch (severity) {
      case 'Critical': return 'text-red-400';
      case 'Warning': return 'text-yellow-400';
      case 'Info': return 'text-blue-400';
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'Critical':
        return <AlertCircle className={getSeverityColor(severity)} size={20} />;
      case 'Warning':
        return <AlertTriangle className={getSeverityColor(severity)} size={20} />;
      case 'Info':
        return <Info className={getSeverityColor(severity)} size={20} />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedSeverity !== 'All' && alert.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'All' && alert.category !== selectedCategory) return false;
    if (!showResolved && alert.resolved) return false;
    return true;
  });

  const summary = {
    critical: alerts.filter(a => a.severity === 'Critical' && !a.resolved).length,
    warning: alerts.filter(a => a.severity === 'Warning' && !a.resolved).length,
    info: alerts.filter(a => a.severity === 'Info' && !a.resolved).length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-400">Critical Alerts</p>
              <p className="text-2xl font-bold">{summary.critical}</p>
            </div>
            <AlertCircle className="text-red-400" size={24} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-400">Warnings</p>
              <p className="text-2xl font-bold">{summary.warning}</p>
            </div>
            <AlertTriangle className="text-yellow-400" size={24} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-400">Info</p>
              <p className="text-2xl font-bold">{summary.info}</p>
            </div>
            <Info className="text-blue-400" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Filter by:</span>
        </div>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value as AlertSeverity | 'All')}
          className="bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm"
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="Warning">Warning</option>
          <option value="Info">Info</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as AlertCategory | 'All')}
          className="bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm"
        >
          <option value="All">All Categories</option>
          <option value="System">System</option>
          <option value="Security">Security</option>
          <option value="Performance">Performance</option>
          <option value="User">User</option>
          <option value="Network">Network</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-400">Show Resolved</span>
        </label>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-4 rounded-lg ${
                alert.resolved 
                  ? 'bg-gray-800 border border-gray-700' 
                  : alert.severity === 'Critical'
                  ? 'bg-red-500/10 border border-red-500/20'
                  : alert.severity === 'Warning'
                  ? 'bg-yellow-500/10 border border-yellow-500/20'
                  : 'bg-blue-500/10 border border-blue-500/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
                      <span>{format(alert.timestamp, 'PPp')}</span>
                      <span>•</span>
                      <span>{alert.category}</span>
                      {alert.resolved && (
                        <>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Check size={14} />
                            <span>Resolved by {alert.resolvedBy}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => onResolve(alert.id)}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Check size={16} className="text-green-400" />
                  </button>
                )}
              </div>
              {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                <div className="mt-2 text-sm text-gray-400">
                  {Object.entries(alert.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="font-medium">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Bell size={24} className="mx-auto mb-2" />
            <p>No alerts match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};