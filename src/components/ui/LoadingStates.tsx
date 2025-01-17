import React from 'react';
import { motion } from 'framer-motion';
import { useQuantumTransaction } from '@/providers/QuantumTransactionProvider';

interface LoadingStatesProps {
  message?: string;
  type?: 'default' | 'quantum' | 'neural' | 'genesis';
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  message = 'Loading...',
  type = 'default'
}) => {
  const { state } = useQuantumTransaction();

  const renderQuantumLoader = () => (
    <div className="relative">
      <motion.div
        className="w-24 h-24 rounded-full border-4 border-cyan-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
          rotate: 360
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-violet-500"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [1, 0.5, 1],
          rotate: -360
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );

  const renderNeuralLoader = () => (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-cyan-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );

  const renderGenesisLoader = () => (
    <motion.div
      className="w-32 h-32 relative"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-violet-500 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 60}deg) translate(40px, 0)`
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity
          }}
        />
      ))}
    </motion.div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'quantum':
        return renderQuantumLoader();
      case 'neural':
        return renderNeuralLoader();
      case 'genesis':
        return renderGenesisLoader();
      default:
        return (
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="mb-6">
        {renderLoader()}
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-cyan-400">
          {message}
        </p>
        
        {state.isProcessing && state.activeTransactions.length > 0 && (
          <p className="text-sm text-cyan-500/60">
            {state.activeTransactions.length} quantum operations in progress
          </p>
        )}
        
        {type === 'quantum' && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
            <span className="text-sm text-cyan-400">
              Maintaining quantum coherence
            </span>
          </div>
        )}
        
        {type === 'neural' && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            <span className="text-sm text-violet-400">
              Synchronizing neural patterns
            </span>
          </div>
        )}
        
        {type === 'genesis' && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            <span className="text-sm text-violet-400">
              Initializing quantum field
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingStates;