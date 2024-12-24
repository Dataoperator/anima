import { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { Actor } from '@dfinity/agent';

const REFRESH_INTERVAL = 30000; // 30 seconds

export const useAdminMetrics = () => {
  const { actor } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;
    const fetchMetrics = async () => {
      try {
        if (!actor) return;

        const currentMetrics = await actor.get_current_metrics();
        setMetrics(currentMetrics);
        
        const metricsHistory = await actor.get_metrics_history(24n);
        setHistory(metricsHistory);
        
        const recentAlerts = await actor.get_recent_alerts(10);
        setAlerts(recentAlerts);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMetrics();
    interval = setInterval(fetchMetrics, REFRESH_INTERVAL);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [actor]);

  const formatMetrics = (raw) => {
    if (!raw) return null;
    
    return {
      totalUsers: Number(raw.total_users),
      activeUsers: Number(raw.active_users),
      totalInteractions: Number(raw.total_interactions),
      cyclesBalance: Number(raw.cycles_balance),
      memoryUsage: Number(raw.memory_usage),
      errorCount: Number(raw.error_count),
      avgResponseTime: Number(raw.avg_response_time),
      timestamp: Number(raw.timestamp),
    };
  };

  const getMetricsForTimeRange = async (hours) => {
    try {
      if (!actor) throw new Error('Actor not initialized');
      
      const history = await actor.get_metrics_history(BigInt(hours));
      return history.map(formatMetrics);
    } catch (err) {
      console.error('Error fetching metrics history:', err);
      throw err;
    }
  };

  return {
    metrics: formatMetrics(metrics),
    history: history.map(formatMetrics),
    alerts,
    loading,
    error,
    getMetricsForTimeRange,
  };
};