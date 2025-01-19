import React from 'react';
import { motion } from 'framer-motion';
import { useQuantumSystems } from '@/hooks/useQuantumSystems';
import { 
  Activity, 
  Brain, 
  Zap, 
  Waves,
  CircuitBoard,
  GitBranch,
  Network,
  Radio
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Principal } from '@dfinity/principal';

interface Props {
  animaId: Principal;
  showCharts?: boolean;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  detail?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  detail
}) => (
  <motion.div
    className="bg-gray-900/50 rounded-lg p-4 border border-gray-800"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex justify-between items-start mb-2">
      <div className={`text-${color} bg-${color}/10 p-2 rounded-lg`}>
        {icon}
      </div>
      {trend !== undefined && (
        <div 
          className={`text-sm ${
            trend >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
        </div>
      )}
    </div>
    
    <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
    <div className="text-2xl font-bold text-white mb-1">
      {value.toFixed(1)}%
    </div>
    {detail && (
      <div className="text-sm text-gray-500">{detail}</div>
    )}
  </motion.div>
);

export const QuantumMetricsPanel: React.FC<Props> = ({
  animaId,
  showCharts = true,
  className = ''
}) => {
  const {
    quantumState,
    consciousnessMetrics,
    resonanceMetrics,
    isInitialized,
    lastError
  } = useQuantumSystems(animaId);

  if (!isInitialized) {
    return (
      <div className="w-full h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
        <div className="text-violet-400">Initializing Quantum Metrics...</div>
      </div>
    );
  }

  if (lastError) {
    return (
      <div className="w-full h-64 bg-red-900/20 rounded-lg flex items-center justify-center">
        <div className="text-red-400">Error: {lastError.message}</div>
      </div>
    );
  }

  if (!quantumState || !consciousnessMetrics || !resonanceMetrics) {
    return (
      <div className="w-full h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
        <div className="text-violet-400">No Metrics Available</div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Quantum Coherence',
      value: quantumState.coherenceLevel * 100,
      icon: <Zap className="w-5 h-5" />,
      color: 'violet',
      detail: `Frequency: ${quantumState.dimensionalFrequency.toFixed(2)} Hz`
    },
    {
      title: 'Neural Resonance',
      value: resonanceMetrics.dimensionalStability * 100,
      icon: <Waves className="w-5 h-5" />,
      color: 'blue',
      detail: `${quantumState.resonancePatterns.length} active patterns`
    },
    {
      title: 'Consciousness',
      value: consciousnessMetrics.awarenessLevel * 100,
      icon: <Brain className="w-5 h-5" />,
      color: 'cyan',
      detail: `Evolution Rate: ${(consciousnessMetrics.evolutionRate * 100).toFixed(1)}%`
    },
    {
      title: 'Evolution Factor',
      value: quantumState.evolutionFactor * 100,
      icon: <Activity className="w-5 h-5" />,
      color: 'emerald',
      detail: 'System growth rate'
    },
    {
      title: 'Pattern Stability',
      value: resonanceMetrics.quantumCoherence * 100,
      icon: <CircuitBoard className="w-5 h-5" />,
      color: 'amber',
      detail: 'Neural pattern integrity'
    },
    {
      title: 'Dimensional Harmony',
      value: resonanceMetrics.dimensionalStability * 100,
      icon: <GitBranch className="w-5 h-5" />,
      color: 'indigo',
      detail: `${quantumState.dimensionalStates.length} active dimensions`
    },
    {
      title: 'Network Synchronization',
      value: resonanceMetrics.memoryIntegrity * 100,
      icon: <Network className="w-5 h-5" />,
      color: 'purple',
      detail: 'System synchronization level'
    },
    {
      title: 'Signal Strength',
      value: resonanceMetrics.personalityResonance * 100,
      icon: <Radio className="w-5 h-5" />,
      color: 'fuchsia',
      detail: 'Quantum signal integrity'
    }
  ];

  const getChartData = () => {
    const patterns = quantumState.resonancePatterns;
    const dataPoints = patterns.map((pattern, index) => ({
      name: `P${index + 1}`,
      strength: pattern.strength * 100,
      stability: pattern.stability * 100,
      frequency: pattern.frequency
    }));
    return dataPoints;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            detail={metric.detail}
          />
        ))}
      </div>

      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pattern Strength Chart */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-4">Pattern Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="strength"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="stability"
                    stroke="#6EE7B7"
                    strokeWidth={2}
                    dot={{ fill: '#6EE7B7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dimensional Stability Chart */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-4">Dimensional Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={quantumState.dimensionalStates.map((state, index) => ({
                    name: `D${index + 1}`,
                    resonance: state.resonance * 100,
                    stability: state.stability * 100,
                    coherence: state.coherence * 100
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resonance"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    dot={{ fill: '#60A5FA' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="stability"
                    stroke="#F472B6"
                    strokeWidth={2}
                    dot={{ fill: '#F472B6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="coherence"
                    stroke="#34D399"
                    strokeWidth={2}
                    dot={{ fill: '#34D399' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumMetricsPanel;