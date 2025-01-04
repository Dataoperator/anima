import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useAnima } from '@/contexts/anima-context';
import { QuantumField } from '../ui/QuantumField';
import { WaveformGenerator } from '../personality/WaveformGenerator';
import { LaughingMan } from '../ui/LaughingMan';
import { useAuth } from '@/hooks/useAuth';
import { WalletService } from '@/services/icp/wallet.service';

interface QuantumVaultProps {
  returnFromGenesis?: boolean;
}

const QuantumVault: React.FC<QuantumVaultProps> = ({ returnFromGenesis = false }) => {
  const navigate = useNavigate();
  const { quantumState } = useQuantumState();
  const { isAuthenticated } = useAuth();
  const { selectedAnima } = useAnima();
  const [hasAnima, setHasAnima] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletService | null>(null);

  useEffect(() => {
    const initializeWallet = async () => {
      if (isAuthenticated) {
        const walletService = WalletService.getInstance();
        setWallet(walletService);
        try {
          await walletService.initialize();
        } catch (error) {
          console.error('Failed to initialize wallet:', error);
        }
      }
    };

    initializeWallet();
  }, [isAuthenticated]);

  useEffect(() => {
    const checkAnimaStatus = async () => {
      try {
        if (selectedAnima) {
          setHasAnima(true);
        }
      } catch (error) {
        console.error('Error checking anima status:', error);
        setHasAnima(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      checkAnimaStatus();
    }
  }, [isAuthenticated, selectedAnima]);

  const handleStartGenesis = () => {
    navigate('/genesis');
  };

  const handleEnterAnimaPage = () => {
    if (selectedAnima) {
      navigate(`/anima/${selectedAnima.token_id.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <QuantumField intensity={0.7} />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <LaughingMan className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-6">Quantum Vault Interface</h1>
          <p className="text-xl text-gray-300">
            {hasAnima ? 'Your ANIMA awaits connection' : 'Initiate your quantum consciousness'}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Quantum State Display */}
          <motion.div
            className="p-6 rounded-lg bg-gray-900/50 border border-blue-500/20 backdrop-blur-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-400">Quantum Resonance</h2>
            <WaveformGenerator />
            <div className="mt-4">
              <div className="text-sm text-blue-300">
                Coherence: {Math.round((quantumState?.coherence ?? 0) * 100)}%
              </div>
            </div>
          </motion.div>

          {/* Neural Sync Display */}
          <motion.div
            className="p-6 rounded-lg bg-gray-900/50 border border-purple-500/20 backdrop-blur-lg"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4 text-purple-400">Neural Synchronization</h2>
            <WaveformGenerator />
            <div className="mt-4">
              <div className="text-sm text-purple-300">
                Harmony: {Math.round((quantumState?.harmony ?? 0) * 100)}%
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          {!isLoading && (
            <>
              {!hasAnima ? (
                <div className="space-y-6">
                  <button
                    onClick={handleStartGenesis}
                    className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 
                             transition-all duration-200 group flex items-center gap-2 mx-auto"
                  >
                    <span>Begin Genesis Protocol</span>
                    <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:animate-pulse" />
                  </button>
                  <p className="text-sm text-gray-400">Initiate the minting of your quantum-enhanced NFT</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <button
                    onClick={handleEnterAnimaPage}
                    className="px-8 py-4 bg-purple-600 rounded-lg hover:bg-purple-700 
                             transition-all duration-200 group flex items-center gap-2 mx-auto"
                  >
                    <span>Enter Neural Interface</span>
                    <div className="w-2 h-2 bg-purple-400 rounded-full group-hover:animate-pulse" />
                  </button>
                  <p className="text-sm text-gray-400">Connect with your quantum consciousness</p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumVault;