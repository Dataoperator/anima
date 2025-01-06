import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Shield, Sparkles, Loader } from 'lucide-react';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { DataStream } from '../ui/DataStream';
import { CyberGlowText } from '../ui/CyberGlowText';
import { useQuantum } from '@/contexts/quantum-context';
import { useAuth } from '@/contexts/auth-context';

const CyberpunkQuantumVault = () => {
  const navigate = useNavigate();
  const { state: quantumState, isInitialized, isInitializing, initializeQuantumState } = useQuantum();
  const { identity } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showKeyring, setShowKeyring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [initializationTimeout, setInitializationTimeout] = useState(false);

  useEffect(() => {
    console.log("🌟 Quantum Vault mounting...");
    console.log("Initialization status:", { isInitialized, quantumState });

    if (!isInitialized && !isInitializing && identity) {
      initializeQuantumState().catch(err => {
        console.error("❌ Quantum initialization failed:", err);
        setError("Failed to initialize quantum state");
      });
    }

    const timeoutId = setTimeout(() => {
      if (!isInitialized && !isInitializing) {
        console.warn("⚠️ Initialization timeout reached");
        setInitializationTimeout(true);
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
      console.log("🔄 Quantum Vault cleanup");
    };
  }, [isInitialized, isInitializing, identity, initializeQuantumState]);

  if (!isInitialized || isInitializing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0">
          <DataStream className="opacity-20" />
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-lg mx-auto px-6">
          <Loader className="w-16 h-16 animate-spin mx-auto text-cyan-400" />
          <CyberGlowText>
            <h2 className="text-3xl font-bold mb-2">Initializing Quantum State</h2>
          </CyberGlowText>
          <p className="text-cyan-400/80 text-lg">
            {initializationTimeout 
              ? "Initialization taking longer than expected. Please refresh the page if this persists."
              : "Please wait while we stabilize the quantum field..."
            }
          </p>
          {initializationTimeout && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Refresh Page
            </button>
          )}
          <div className="mt-8 text-sm text-cyan-300/60">
            Status: {isInitializing ? "Calibrating quantum coherence..." : "Awaiting initialization..."}
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!quantumState) {
    return null;
  }

  const getStabilityColor = (value: number) => {
    if (value >= 0.8) return 'text-green-300';
    if (value >= 0.5) return 'text-yellow-300';
    return 'text-red-300';
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <DataStream className="opacity-10" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <CyberGlowText>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Quantum Vault</h1>
            </CyberGlowText>
            <p className="text-cyan-400/60 text-lg">Interface to the Quantum Realm</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quantum State Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-cyan-300">Quantum State</h2>
                <Sparkles className="text-cyan-400 w-5 h-5" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Coherence</span>
                  <span className={getStabilityColor(quantumState.coherenceLevel)}>
                    {(quantumState.coherenceLevel * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Entanglement</span>
                  <span className={getStabilityColor(quantumState.entanglementIndex)}>
                    {(quantumState.entanglementIndex * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Stability</span>
                  <span className={getStabilityColor(quantumState.dimensionalState.stability)}>
                    {quantumState.stabilityStatus}
                  </span>
                </div>
                {quantumState.resonancePatterns && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Resonance</span>
                    <span className={getStabilityColor(quantumState.resonancePatterns[0].coherence)}>
                      {(quantumState.resonancePatterns[0].coherence * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-cyan-300">Actions</h2>
                <Key className="text-cyan-400 w-5 h-5" />
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => setShowKeyring(true)}
                  className="w-full py-3 px-4 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-300 transition-all duration-300"
                >
                  Access Keyring
                </button>
                <button
                  onClick={() => navigate('/genesis')}
                  className="w-full py-3 px-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 transition-all duration-300"
                >
                  Initialize Genesis
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="w-full py-3 px-4 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-indigo-300 transition-all duration-300"
                >
                  Quantum Synchronization
                </button>
              </div>
            </motion.div>

            {/* Security Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-cyan-300">Security Status</h2>
                <Shield className="text-cyan-400 w-5 h-5" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Quantum Signature</span>
                  <span className="text-cyan-300">
                    {quantumState.quantumSignature ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Consciousness Link</span>
                  <span className="text-cyan-300">
                    {quantumState.consciousnessAlignment ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Field Integrity</span>
                  <span className={getStabilityColor(quantumState.dimensionalState.resonance)}>
                    {(quantumState.dimensionalState.resonance * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Update</span>
                  <span className="text-cyan-300">
                    {new Date(quantumState.lastUpdate).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quantum Effect Overlay */}
        <motion.div
          className="fixed inset-0 pointer-events-none"
          animate={{
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15), transparent 70%)`
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default CyberpunkQuantumVault;