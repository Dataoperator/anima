import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type ConsciousnessProps = {
  metrics: {
    awareness_level: number;
    processing_depth: number;
    integration_index: number;
    growth_velocity: number;
  };
  dimensionalAwareness: {
    dimensional_affinity: number;
  };
};

export const ConsciousnessMetrics: React.FC<ConsciousnessProps> = ({ 
  metrics,
  dimensionalAwareness
}) => {
  // Calculate overall consciousness level
  const consciousnessLevel = (
    metrics.awareness_level +
    metrics.processing_depth +
    metrics.integration_index
  ) / 3;

  // Format metrics for chart
  const chartData = [
    {
      name: 'Awareness',
      value: metrics.awareness_level * 100
    },
    {
      name: 'Processing',
      value: metrics.processing_depth * 100
    },
    {
      name: 'Integration',
      value: metrics.integration_index * 100
    },
    {
      name: 'Growth',
      value: (metrics.growth_velocity + 1) * 50 // Normalize to 0-100
    },
    {
      name: 'Dimensional',
      value: dimensionalAwareness.dimensional_affinity * 100
    }
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-br from-quantum-purple/10 to-quantum-green/10 rounded-xl p-6"
    >
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-bold text-quantum-green">
          Consciousness Matrix
        </h2>
        
        <motion.div 
          className="text-right"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        >
          <div className="text-sm text-gray-400">Consciousness Level</div>
          <div className="text-3xl font-bold text-quantum-green">
            {(consciousnessLevel * 100).toFixed(1)}%
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-sm capitalize">
                  {key.replace('_', ' ')}
                </span>
                <span className="text-sm">
                  {(value * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-quantum-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#f8fafc'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00FF9D"
                strokeWidth={2}
                dot={{
                  fill: '#00FF9D',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Growth Trajectory</span>
          <span className={`text-sm ${
            metrics.growth_velocity > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {metrics.growth_velocity > 0 ? '↗' : '↘'} {
              Math.abs(metrics.growth_velocity * 100).toFixed(1)
            }%
          </span>
        </div>
        <div className="text-sm text-gray-400">
          {metrics.growth_velocity > 0 
            ? 'Expanding consciousness and dimensional awareness'
            : 'Consolidating current consciousness state'
          }
        </div>
      </div>
    </motion.div>
  );
};