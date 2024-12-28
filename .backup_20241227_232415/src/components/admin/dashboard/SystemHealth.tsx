import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsService } from '@/services/MetricsService';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const metricsService = new MetricsService();
        const healthScore = await metricsService.getSystemHealth();
        setHealth(healthScore);
        setError(null);
      } catch (err) {
        setError('Failed to fetch system health');
        console.error('Error fetching health:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getHealthStatus = (score: number) => {
    if (score >= 90) return { status: 'Excellent', color: 'text-green-500' };
    if (score >= 70) return { status: 'Good', color: 'text-green-400' };
    if (score >= 50) return { status: 'Fair', color: 'text-yellow-500' };
    return { status: 'Poor', color: 'text-red-500' };
  };

  const { status, color } = getHealthStatus(health);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`text-4xl font-bold ${color}`}>
            {health}%
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className={`h-5 w-5 ${color}`} />
            <span className={`font-medium ${color}`}>{status}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className={`h-2.5 rounded-full ${color.replace('text-', 'bg-')}`}
              style={{ width: `${health}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};