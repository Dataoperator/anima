import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from '../ui/card';
import { ErrorHandler } from '../../error/error-handler';
import { useQuantumState } from '../../hooks/useQuantumState';

interface ErrorMetric {
  timestamp: number;
  type: string;
  count: number;
}

interface SystemMetric {
  timestamp: number;
  coherence: number;
  stability: number;
  errorRate: number;
}

const QADashboard: React.FC = () => {
  const [errorMetrics, setErrorMetrics] = useState<ErrorMetric[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const { state: quantumState } = useQuantumState();

  useEffect(() => {
    const updateMetrics = () => {
      const errors = ErrorHandler.getErrorStats();
      const newErrorMetric = {
        timestamp: Date.now(),
        type: 'total',
        count: Object.values(errors).reduce((a, b) => a + b, 0)
      };

      const newSystemMetric = {
        timestamp: Date.now(),
        coherence: quantumState?.coherence || 0,
        stability: quantumState?.stability || 0,
        errorRate: newErrorMetric.count
      };

      setErrorMetrics(prev => [...prev.slice(-50), newErrorMetric]);
      setSystemMetrics(prev => [...prev.slice(-50), newSystemMetric]);
    };

    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [quantumState]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">ANIMA System QA Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Health Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className="h-80">
            <LineChart width={500} height={300} data={systemMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
              <YAxis />
              <Tooltip
                formatter={(value: number) => value.toFixed(2)}
                labelFormatter={formatTimestamp}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="coherence"
                stroke="#8884d8"
                name="Quantum Coherence"
              />
              <Line
                type="monotone"
                dataKey="stability"
                stroke="#82ca9d"
                name="System Stability"
              />
            </LineChart>
          </div>
        </Card>

        {/* Error Tracking Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Error Tracking</h2>
          <div className="h-80">
            <LineChart width={500} height={300} data={errorMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
              <YAxis />
              <Tooltip
                formatter={(value: number) => value.toFixed(0)}
                labelFormatter={formatTimestamp}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#ff8884"
                name="Error Count"
              />
            </LineChart>
          </div>
        </Card>

        {/* Component Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Component Status</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(quantumState || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-600">{key}:</span>
                <span className="font-mono">
                  {typeof value === 'number' ? value.toFixed(3) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Error Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Error Distribution</h2>
          <div className="space-y-2">
            {Object.entries(ErrorHandler.getErrorStats()).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-600">{type}:</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QADashboard;