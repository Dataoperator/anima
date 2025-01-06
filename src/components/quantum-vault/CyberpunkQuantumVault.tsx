import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Shield } from 'lucide-react';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { DataStream } from '../ui/DataStream';
import { CyberGlowText } from '../ui/CyberGlowText';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useFieldState } from '@/hooks/useFieldState';
import { keyringService } from '@/services/keyring.service';
import { walletService } from '@/services/wallet.service';

const CyberpunkQuantumVault: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showKeyring, setShowKeyring] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const quantumState = useQuantumState();
  const fieldState = useFieldState();

  // ... (previous hooks and handlers remain the same)

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden">
        {/* Main content remains the same up to modals */}
        
        {/* Modals Container */}
        <div className="relative z-50">
          {/* Deposit Modal */}
          <AnimatePresence>
            {showDepositModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                onClick={() => !isProcessing && setShowDepositModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900/90 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full mx-4 space-y-4"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="space-y-4">
                    <CyberGlowText>
                      <h2 className="text-xl font-bold text-cyan-300">Deposit ICP</h2>
                    </CyberGlowText>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Amount (ICP)</label>
                        <input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          disabled={isProcessing}
                          className="w-full px-4 py-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-cyan-300/30 focus:outline-none focus:border-cyan-500/50"
                          placeholder="Enter amount..."
                        />
                      </div>

                      <button
                        onClick={handleDeposit}
                        disabled={!depositAmount || isProcessing}
                        className={`w-full px-4 py-3 rounded-lg ${
                          isProcessing
                            ? 'bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed'
                            : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                        } transition-colors backdrop-blur-sm flex items-center gap-2 justify-center`}
                      >
                        {isProcessing ? 'Processing...' : 'Confirm Deposit'}
                      </button>
                    </div>

                    <div className="text-sm text-gray-400 pt-4 border-t border-gray-700/50">
                      Deposit ICP to mint your quantum-enhanced ANIMA NFT.
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-900/50 backdrop-blur-sm border border-emerald-500/30 rounded-lg p-8 text-center"
              >
                <div className="space-y-4">
                  <CyberGlowText className="space-y-2">
                    <h2 className="text-2xl font-bold text-emerald-400">
                      Interface Initialized
                    </h2>
                    <p className="text-emerald-300">Quantum State Stabilized</p>
                    <p className="text-emerald-300">Neural Patterns Synchronized</p>
                  </CyberGlowText>

                  <motion.div
                    className="h-1 bg-emerald-900 rounded-full overflow-hidden mt-4"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  >
                    <div className="h-full bg-emerald-400" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyring Modal */}
          <AnimatePresence>
            {showKeyring && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                onClick={() => setShowKeyring(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900/90 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full mx-4"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="space-y-4">
                    <CyberGlowText>
                      <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Select Access Method
                      </h2>
                    </CyberGlowText>

                    <div className="space-y-4">
                      {[
                        { name: "Browser Secure Storage", type: "browser_storage_key", Icon: Shield, color: "cyan" },
                        { name: "Quantum Seed Phrase", type: "seed_phrase", Icon: Key, color: "purple" },
                        { name: "Import PEM Certificate", type: "pem_file", Icon: Shield, color: "emerald" }
                      ].map(({ name, type, Icon, color }) => (
                        <button
                          key={type}
                          onClick={() => handleKeyringInit({ name: "ANIMA", keyType: type })}
                          className={`w-full px-4 py-3 rounded-lg flex items-center gap-2 justify-center transition-colors backdrop-blur-sm 
                            ${color === 'cyan' 
                              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                              : color === 'purple'
                                ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                          {name}
                        </button>
                      ))}
                    </div>

                    <div className="text-sm text-gray-400 pt-4 border-t border-gray-700/50">
                      Secure quantum-enhanced key management for ANIMA transactions.
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

export default CyberpunkQuantumVault;