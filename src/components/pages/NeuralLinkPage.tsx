import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import IntegratedNeuralLinkInterface from '../neural-link/IntegratedNeuralLinkInterface';
import { useAnima } from '../../hooks/useAnima';
import { LoadingStates } from '../ui/LoadingStates';
import { MatrixRain } from '../ui/MatrixRain';
import { useQuantumState } from '../../hooks/useQuantumState';

export const NeuralLinkPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { anima, isLoading, error } = useAnima(id);
  const [isInitialized, setIsInitialized] = useState(false);
  const { state: quantumState, initializeQuantumState } = useQuantumState();

  useEffect(() => {
    const initializeNeuralLink = async () => {
      if (!anima) return;

      try {
        await initializeQuantumState();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize neural link:', error);
      }
    };

    initializeNeuralLink();
  }, [anima, initializeQuantumState]);

  if (isLoading) {
    return <LoadingStates />;
  }

  if (error || !anima) {
    return (
      <div className="min-h-screen bg-black text-cyan-500 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl">Neural Link Connection Failed</h2>
          <p className="text-cyan-400/60">{error || 'ANIMA not found'}</p>
          <button
            onClick={() => navigate('/quantum-vault')}
            className="px-4 py-2 border border-cyan-500 hover:bg-cyan-500/10 transition-colors"
          >
            Return to Quantum Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black"
    >
      <MatrixRain opacity={0.1} />
      
      <AnimatePresence mode="wait">
        {!isInitialized ? (
          <motion.div
            key="initializing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen"
          >
            <div className="text-center space-y-4 text-cyan-500">
              <h2 className="text-2xl font-bold">Initializing Neural Link</h2>
              <p>Establishing quantum coherence...</p>
              <div className="w-48 h-1 bg-cyan-900 mx-auto rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500"
                  animate={{
                    width: ['0%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    ease: 'linear',
                    repeat: Infinity
                  }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="interface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto p-4"
          >
            <IntegratedNeuralLinkInterface />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NeuralLinkPage;