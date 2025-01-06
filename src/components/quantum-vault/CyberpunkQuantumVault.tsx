import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Shield, Sparkles } from 'lucide-react';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { DataStream } from '../ui/DataStream';
import { CyberGlowText } from '../ui/CyberGlowText';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useFieldState } from '@/hooks/useFieldState';
import { keyringService } from '@/services/keyring.service';
import { walletService } from '@/services/wallet.service';
import { AnimaGenesis } from '../anima/initialization/AnimaGenesis';

const CyberpunkQuantumVault = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showKeyring, setShowKeyring] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state: quantumState, updateQuantumState } = useQuantumState();
  const { fieldState, updateFieldState } = useFieldState();

  // Handle minting
  const handleStartMint = async () => {
    if (!walletService.hasEnoughForMint()) {
      setError('Insufficient balance for minting');
      return;
    }

    if (quantumState.coherenceLevel < 0.7) {
      setError('Quantum coherence too low for minting');
      return;
    }

    // Navigate directly to genesis - it will handle autonomous designation
    navigate('/genesis', { 
      state: { 
        fromVault: true,
        quantumState: quantumState,  // Pass current quantum state
        fieldState: fieldState       // Pass field state for designation
      } 
    });
  };

  // ... rest of your existing component code ...

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden">
        {/* Existing quantum field and background effects */}
        <DataStream className="absolute inset-0 opacity-20" />

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <CyberGlowText>
              <h1 className="text-4xl font-bold mb-4">Quantum Vault Interface</h1>
            </CyberGlowText>
            <p className="text-lg text-cyan-400/80">
              Secure Quantum-Enhanced Storage System v2.0
            </p>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatusCard
              title="Quantum Coherence"
              value={`${(quantumState.coherenceLevel * 100).toFixed(1)}%`}
              status={quantumState.coherenceLevel > 0.7 ? 'optimal' : 'warning'}
            />
            <StatusCard
              title="Field Stability"
              value={`${(fieldState.stability * 100).toFixed(1)}%`}
              status={fieldState.stability > 0.8 ? 'optimal' : 'warning'}
            />
            <StatusCard
              title="Balance"
              value={`${Number(walletService.getState().balance) / 100_000_000} ICP`}
              status={walletService.hasEnoughForMint() ? 'optimal' : 'warning'}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowKeyring(true)}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                isProcessing 
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
              } transition-colors`}
            >
              <Shield className="w-5 h-5" />
              Access Keyring
            </button>

            <button
              onClick={handleStartMint}
              disabled={isProcessing || !walletService.hasEnoughForMint() || quantumState.coherenceLevel < 0.7}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                isProcessing || !walletService.hasEnoughForMint() || quantumState.coherenceLevel < 0.7
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
              } transition-colors`}
            >
              <Sparkles className="w-5 h-5" />
              Initialize ANIMA
            </button>
          </div>

          {/* System Status */}
          {(error || !walletService.hasEnoughForMint() || quantumState.coherenceLevel < 0.7) && (
            <div className="mt-8">
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}
              {!walletService.hasEnoughForMint() && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-300">
                    Insufficient balance. Required: {Number(walletService.getMintCost()) / 100_000_000} ICP
                  </p>
                </div>
              )}
              {quantumState.coherenceLevel < 0.7 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-300">
                    Quantum coherence too low. Minimum required: 70%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Keyring Modal */}
          <AnimatePresence>
            {showKeyring && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => !isProcessing && setShowKeyring(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900/90 border border-purple-500/30 rounded-lg p-6 max-w-md w-full mx-4"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="space-y-4">
                    <CyberGlowText>
                      <h2 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Select Access Method
                      </h2>
                    </CyberGlowText>

                    <div className="space-y-4">
                      {[
                        { name: "Browser Secure Storage", type: "browser_storage_key", Icon: Shield },
                        { name: "Quantum Seed Phrase", type: "seed_phrase", Icon: Key }
                      ].map(({ name, type, Icon }) => (
                        <button
                          key={type}
                          onClick={() => handleKeyringInit({ name, keyType: type })}
                          disabled={isProcessing}
                          className={`w-full px-4 py-3 rounded-lg flex items-center gap-2 justify-center ${
                            isProcessing
                              ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                              : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                          } transition-colors`}
                        >
                          <Icon className="w-5 h-5" />
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Helper Components
const StatusCard: React.FC<{
  title: string;
  value: string;
  status: 'optimal' | 'warning' | 'error';
}> = ({ title, value, status }) => (
  <div className={`p-4 rounded-lg border ${
    status === 'optimal' 
      ? 'border-cyan-500/30 bg-cyan-900/20' 
      : status === 'warning'
        ? 'border-yellow-500/30 bg-yellow-900/20'
        : 'border-red-500/30 bg-red-900/20'
  }`}>
    <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
    <p className={`text-2xl font-bold ${
      status === 'optimal'
        ? 'text-cyan-300'
        : status === 'warning'
          ? 'text-yellow-300'
          : 'text-red-300'
    }`}>
      {value}
    </p>
  </div>
);

export default CyberpunkQuantumVault;