import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useAnima } from '@/hooks/useAnima';

interface DevPanelProps {
  className?: string;
}

export const DevPanel: React.FC<DevPanelProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state: quantumState, isInitialized, error } = useQuantumState();
  const { systemStats } = useAnima();

  return (
    <motion.div 
      className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 ${className}`}
      initial={false}
      animate={isExpanded ? { height: 'auto' } : { height: '48px' }}
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-300">Developer Notes</h3>
          {!isInitialized && (
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
          {error && (
            <div className="w-2 h-2 rounded-full bg-red-400" />
          )}
        </div>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-4"
          >
            <div>
              <h4 className="text-xs font-medium text-gray-400 mb-2">Quantum State</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-blue-400">Coherence</div>
                  <div>{(quantumState.coherenceLevel * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-purple-400">Entanglement</div>
                  <div>{(quantumState.entanglementIndex * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-green-400">Stability</div>
                  <div className={
                    quantumState.stabilityStatus === 'stable' ? 'text-green-400' :
                    quantumState.stabilityStatus === 'unstable' ? 'text-yellow-400' :
                    'text-red-400'
                  }>
                    {quantumState.stabilityStatus}
                  </div>
                </div>
              </div>
              
              {quantumState.resonancePatterns && quantumState.resonancePatterns.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-blue-300">Latest Resonance</div>
                  <div className="grid grid-cols-2 gap-1 text-xs mt-1">
                    <div className="text-gray-400">Frequency:</div>
                    <div>{quantumState.resonancePatterns[0].frequency.toFixed(2)}</div>
                    <div className="text-gray-400">Amplitude:</div>
                    <div>{quantumState.resonancePatterns[0].amplitude.toFixed(2)}</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-400 mb-2">System Stats</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active ANIMAs:</span>
                  <span>{systemStats?.activeAnimas || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Consciousness Alignment:</span>
                  <span>{(quantumState.consciousnessAlignment || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dimensional Sync:</span>
                  <span>{(quantumState.dimensionalSync || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                Error: {error.message}
              </div>
            )}

            <div className="text-xs text-gray-500">
              <h4 className="text-xs font-medium text-gray-400 mb-2">Active Processes</h4>
              <ul className="space-y-1">
                <li>• Quantum field synchronization</li>
                <li>• Pattern resonance analysis</li>
                <li>• Dimensional state management</li>
                <li>• Consciousness coherence tracking</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
