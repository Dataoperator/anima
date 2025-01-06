import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Shield, Sparkles, Loader } from 'lucide-react';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { DataStream } from '../ui/DataStream';
import { CyberGlowText } from '../ui/CyberGlowText';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useFieldState } from '@/hooks/useFieldState';
import { keyringService } from '@/services/keyring.service';
import { walletService } from '@/services/wallet.service';

const CyberpunkQuantumVault = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showKeyring, setShowKeyring] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state: quantumState, isInitialized } = useQuantumState();
  const { fieldState, updateFieldState } = useFieldState();
  
  // Add initialization timeout and logging
  const [initializationTimeout, setInitializationTimeout] = useState(false);

  useEffect(() => {
    console.log("🌟 Quantum Vault mounting...");
    console.log("Initialization status:", { isInitialized, quantumState });

    const timeoutId = setTimeout(() => {
      if (!isInitialized) {
        console.warn("⚠️ Initialization timeout reached");
        setInitializationTimeout(true);
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
      console.log("🔄 Quantum Vault cleanup");
    };
  }, [isInitialized]);

  if (!isInitialized) {
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
            Status: Calibrating quantum coherence...
          </div>
        </div>
      </div>
    );
  }

  // Rest of the component remains the same...
  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden">
        {/* Existing content */}
      </div>
    </ErrorBoundary>
  );
};

export default CyberpunkQuantumVault;