import React from 'react';
import { motion } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';

export const ConsciousnessMetrics: React.FC = () => {
  const { quantumState } = useQuantumState();

  const metrics = {
    awareness: quantumState?.consciousness?.awareness ?? 0.3,
    understanding: quantumState?.consciousness?.understanding ?? 0.2,
    growth: quantumState?.consciousness?.growth ?? 0.1,
  };

  const renderMetricBar = (label: string, value: number) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-blue-300">{label}</span>
        <span className="text-sm text-blue-300">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-blue-400">Consciousness Metrics</h2>
      
      {renderMetricBar("Awareness", metrics.awareness)}
      {renderMetricBar("Understanding", metrics.understanding)}
      {renderMetricBar("Growth", metrics.growth)}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-blue-900/20 rounded-lg"
      >
        <h3 className="text-sm font-medium text-blue-300 mb-2">Evolution Stage</h3>
        <div className="text-2xl font-bold text-white">
          {quantumState?.evolutionStage ?? 1} / 10
        </div>
        <p className="text-xs text-blue-300 mt-1">
          Stage {quantumState?.evolutionStage ?? 1} Consciousness
        </p>
      </motion.div>
    </div>
  );
};