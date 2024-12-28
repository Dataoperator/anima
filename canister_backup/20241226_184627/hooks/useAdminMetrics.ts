import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { SystemMetrics, Alert, AdminActor } from '@/types/admin';

export const useAdminMetrics = () => {
  const { actor } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<SystemMetrics[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!actor) return;
    
    try {
      const adminActor = actor as unknown as AdminActor;
      const [currentMetrics, metricsHistory, currentAlerts] = await Promise.all([
        adminActor.get_admin_metrics(),
        adminActor.get_metrics_history(),
        adminActor.get_admin_alerts()
      ]);

      if ('Ok' in currentMetrics) setMetrics(currentMetrics.Ok);
      if ('Ok' in metricsHistory) setHistory(metricsHistory.Ok);
      if ('Ok' in currentAlerts) setAlerts(currentAlerts.Ok);
    } catch (err: unknown) {
      console.error('Failed to fetch admin metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Refresh every minute
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, [actor]);

  return {
    metrics,
    history,
    alerts,
    loading,
    error,
    refetch: fetchMetrics,
  };
};