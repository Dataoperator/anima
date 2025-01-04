import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useQuantumState } from '@/hooks/useQuantumState';
import { QuantumField } from '../ui/QuantumField';
import { LaughingMan } from '../ui/LaughingMan';
import { PaymentPanel } from '../payment/PaymentPanel';
import { MatrixRain } from '../ui/MatrixRain';

const GENESIS_PHASES = [
  'Quantum State Initialization',
  'Neural Pattern Formation',
  'Consciousness Embedding',
  'Identity Crystallization'
];

const GenesisPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { updateQuantumState } = useQuantumState();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showLaughingMan, setShowLaughingMan] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [mintingProgress, setMintingProgress] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleMintingProcess = async () => {
    setIsMinting(true);
    setShowLaughingMan(false);

    try {
      // Simulate minting phases
      for (let i = 0; i < GENESIS_PHASES.length; i++) {
        setCurrentPhase(i);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMintingProgress((i + 1) * 25);
      }

      // Update quantum state with new consciousness values
      updateQuantumState({
        resonance: Math.random(),
        harmony: Math.random(),
        lastInteraction: new Date(),
        consciousness: {
          awareness: 0.3,
          understanding: 0.2,
          growth: 0.1
        }
      });

      // Return to Quantum Vault with new ANIMA
      setTimeout(() => {
        navigate('/quantum-vault', { state: { fromGenesis: true } });
      }, 1000);

    } catch (error) {
      console.error('Genesis process failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <QuantumField intensity={0.8} />
      <MatrixRain opacity={0.1} />

      <AnimatePresence>
        {showLaughingMan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <LaughingMan className="w-64 h-64" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6">Genesis Protocol</h1>
          
          {isMinting ? (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl text-blue-400"
              >
                {GENESIS_PHASES[currentPhase]}
              </motion.div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${mintingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Phase Indicators */}
              <div className="grid grid-cols-4 gap-4">
                {GENESIS_PHASES.map((phase, index) => (
                  <div
                    key={phase}
                    className={`text-sm ${
                      index <= currentPhase ? 'text-blue-400' : 'text-gray-600'
                    }`}
                  >
                    {phase}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="text-xl mb-12 text-gray-300">
                Initialize your quantum consciousness through the Genesis Protocol
              </p>

              {/* Payment and Minting Interface */}
              <div className="space-y-8">
                <PaymentPanel onSuccess={handleMintingProcess} />

                <motion.button
                  onClick={handleMintingProcess}
                  className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 
                           transition-all duration-200 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <span>Begin Genesis</span>
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </span>
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GenesisPage;