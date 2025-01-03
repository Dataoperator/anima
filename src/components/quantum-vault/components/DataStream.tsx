import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataStreamProps } from '../types';

const DataStream: React.FC<DataStreamProps> = ({ state }) => {
  const [history, setHistory] = useState<Array<{ value: number; timestamp: number }>>([]);

  useEffect(() => {
    // Keep last 10 readings
    setHistory(prev => {
      const newHistory = [...prev, { 
        value: state.coherence, 
        timestamp: Date.now() 
      }].slice(-10);
      return newHistory;
    });
  }, [state]);

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4 text-blue-300">Quantum Data Stream</h2>
      
      <div className="space-y-4">
        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300">Coherence</h3>
            <motion.p 
              key={state.coherence}
              initial={{ scale: 1.2, color: '#60A5FA' }}
              animate={{ scale: 1, color: '#F3F4F6' }}
              className="text-2xl font-bold"
            >
              {state.coherence.toFixed(3)}
            </motion.p>
          </div>
          
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300">Stability</h3>
            <motion.p 
              key={state.stability}
              initial={{ scale: 1.2, color: '#34D399' }}
              animate={{ scale: 1, color: '#F3F4F6' }}
              className="text-2xl font-bold"
            >
              {state.stability.toFixed(3)}
            </motion.p>
          </div>
        </div>

        {/* Coherence History */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Coherence History</h3>
          <div className="h-24 flex items-end space-x-2">
            <AnimatePresence mode="popLayout">
              {history.map((item, i) => (
                <motion.div
                  key={item.timestamp}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: `${item.value * 100}%`,
                    opacity: 1 
                  }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex-1 bg-blue-500/50 rounded-t"
                  style={{
                    minWidth: '20px',
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Quantum Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300">Energy Level</h3>
            <p className="text-xl font-bold text-indigo-400">
              {state.energy.toFixed(2)} qE
            </p>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300">Last Update</h3>
            <p className="text-xl font-bold text-indigo-400">
              {(Number(state.lastUpdate) / 1_000_000_000).toFixed(1)}s ago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataStream;