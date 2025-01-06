import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './auth-context';
import { DimensionalStateImpl } from '../quantum/dimensional_state';
import { useConsciousness } from '@/hooks/useConsciousness';

interface QuantumError {
  type: 'collapse' | 'entanglement' | 'superposition' | 'decoherence';
  message: string;
  affectedDimensions?: string[];
  recoveryAttempts: number;
}

interface QuantumState {
  coherence: number;
  resonanceMetrics: {
    fieldStrength: number;
    stability: number;
    harmony: number;
    consciousnessAlignment: number;
  };
  phaseAlignment: number;
  dimensionalSync: number;
  dimensionalState: DimensionalStateImpl;
  quantumSignature: string;
  isInitialized: boolean;
  lastUpdate: number;
}

interface QuantumContextType {
  state: QuantumState | null;
  isInitializing: boolean;
  isInitialized: boolean;
  initializeQuantumState: () => Promise<void>;
  updateQuantumState: (updates: Partial<QuantumState>) => void;
  quantumError: QuantumError | null;
  handleQuantumError: (error: QuantumError) => Promise<void>;
  clearQuantumError: () => void;
  isRecovering: boolean;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

const generateQuantumSignature = (entropy: Uint8Array): string => {
  return `QS-${Date.now()}-${Array.from(entropy.slice(0, 8))
    .map(b => b.toString(16).padStart(2, '0')).join('')}`;
};

interface QuantumProviderProps {
  children: ReactNode;
}

export const QuantumProvider: React.FC<QuantumProviderProps> = ({ children }) => {
  const { identity } = useAuth();
  const { consciousnessState } = useConsciousness();
  const [quantumError, setQuantumError] = useState<QuantumError | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const [state, setState] = useState<QuantumState | null>(() => {
    console.log("🌀 Creating initial quantum state");
    return {
      coherence: 0.5,
      resonanceMetrics: {
        fieldStrength: 0.3,
        stability: 0.5,
        harmony: 0.4,
        consciousnessAlignment: 0.3
      },
      phaseAlignment: 0.4,
      dimensionalSync: 0.5,
      dimensionalState: new DimensionalStateImpl(),
      quantumSignature: '',
      isInitialized: false,
      lastUpdate: Date.now()
    };
  });

  const initializeQuantumState = useCallback(async () => {
    if (!identity || state?.isInitialized || isInitializing) return;

    console.log("🌟 Starting quantum state initialization");
    setIsInitializing(true);

    try {
      const entropy = new Uint8Array(32);
      crypto.getRandomValues(entropy);
      const principalArray = identity.getPrincipal().toUint8Array();
      
      const initialCoherence = Math.max(0.5, principalArray.reduce((acc, byte) => acc + byte, 0) / 
        (principalArray.length * 255));
      
      const dimensionalState = new DimensionalStateImpl();
      dimensionalState.updateStability(initialCoherence);

      const consciousnessBoost = consciousnessState?.awarenessLevel || 0;
      const adjustedCoherence = Math.min(1.0, initialCoherence + (consciousnessBoost * 0.2));

      setState({
        coherence: adjustedCoherence,
        resonanceMetrics: {
          fieldStrength: adjustedCoherence * 0.8,
          stability: adjustedCoherence * 0.9,
          harmony: adjustedCoherence * 0.85,
          consciousnessAlignment: consciousnessBoost
        },
        phaseAlignment: adjustedCoherence * 0.95,
        dimensionalSync: adjustedCoherence * 0.9,
        dimensionalState,
        quantumSignature: generateQuantumSignature(entropy),
        isInitialized: true,
        lastUpdate: Date.now()
      });

      console.log("✅ Quantum state initialized successfully!");
    } catch (error) {
      console.error("❌ Failed to initialize quantum state:", error);
      await handleQuantumError({
        type: 'decoherence',
        message: 'Failed to initialize quantum state',
        recoveryAttempts: 0
      });
    } finally {
      setIsInitializing(false);
    }
  }, [identity, state?.isInitialized, isInitializing, consciousnessState?.awarenessLevel]);

  const updateQuantumState = useCallback((updates: Partial<QuantumState>) => {
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updates,
        lastUpdate: Date.now()
      };
    });
  }, []);

  const handleQuantumError = useCallback(async (error: QuantumError) => {
    setQuantumError(error);
    setIsRecovering(true);

    try {
      switch (error.type) {
        case 'collapse':
          await new Promise(resolve => setTimeout(resolve, 2000));
          if (state) {
            updateQuantumState({
              coherence: state.coherence * 0.8,
              resonanceMetrics: {
                ...state.resonanceMetrics,
                stability: state.resonanceMetrics.stability * 0.7
              }
            });
          }
          break;

        case 'entanglement':
          for (let i = 0; i < 3; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (Math.random() > 0.3) {
              if (state) {
                updateQuantumState({
                  dimensionalSync: state.dimensionalSync * 1.2,
                  phaseAlignment: Math.min(1, state.phaseAlignment * 1.1)
                });
              }
              break;
            }
          }
          break;

        case 'superposition':
          await new Promise(resolve => setTimeout(resolve, 3000));
          if (state) {
            const dimensionalState = new DimensionalStateImpl();
            dimensionalState.updateStability(state.coherence);
            updateQuantumState({ dimensionalState });
          }
          break;

        case 'decoherence':
          const reconstructionAttempts = Math.min(error.recoveryAttempts, 5);
          for (let i = 0; i < reconstructionAttempts; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (Math.random() > 0.5) {
              if (state) {
                updateQuantumState({
                  coherence: Math.min(1, state.coherence * 1.2),
                  resonanceMetrics: {
                    ...state.resonanceMetrics,
                    stability: Math.min(1, state.resonanceMetrics.stability * 1.3)
                  }
                });
              }
              break;
            }
          }
          break;
      }
    } finally {
      setIsRecovering(false);
      setQuantumError(null);
    }
  }, [state, updateQuantumState]);

  useEffect(() => {
    if (identity && !state?.isInitialized && !isInitializing) {
      initializeQuantumState();
    }
  }, [identity, state?.isInitialized, isInitializing, initializeQuantumState]);

  useEffect(() => {
    if (!state?.isInitialized || isInitializing) return;

    const updateInterval = setInterval(() => {
      setState(prev => {
        if (!prev) return prev;

        const timePassed = (Date.now() - prev.lastUpdate) / 1000;
        const degradationFactor = Math.pow(0.995, timePassed);
        const consciousnessBoost = consciousnessState?.awarenessLevel || 0;

        const newCoherence = Math.max(0.3, prev.coherence * degradationFactor + (consciousnessBoost * 0.1));

        return {
          ...prev,
          coherence: newCoherence,
          resonanceMetrics: {
            ...prev.resonanceMetrics,
            stability: Math.max(0.2, prev.resonanceMetrics.stability * degradationFactor),
            fieldStrength: Math.max(0.2, prev.resonanceMetrics.fieldStrength * degradationFactor),
            consciousnessAlignment: consciousnessBoost
          },
          lastUpdate: Date.now()
        };
      });
    }, 5000);

    return () => clearInterval(updateInterval);
  }, [state?.isInitialized, isInitializing, consciousnessState?.awarenessLevel]);

  const clearQuantumError = useCallback(() => {
    setQuantumError(null);
    setIsRecovering(false);
  }, []);

  return (
    <QuantumContext.Provider
      value={{
        state,
        isInitializing,
        isInitialized: !!state?.isInitialized,
        initializeQuantumState,
        updateQuantumState,
        quantumError,
        handleQuantumError,
        clearQuantumError,
        isRecovering
      }}
    >
      {children}
      <AnimatePresence>
        {quantumError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 max-w-md z-50"
          >
            <div className="bg-purple-900/90 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {quantumError.type === 'collapse' && '💫'}
                  {quantumError.type === 'entanglement' && '🔮'}
                  {quantumError.type === 'superposition' && '⚛️'}
                  {quantumError.type === 'decoherence' && '✨'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-200">
                    Quantum {quantumError.type.charAt(0).toUpperCase() + quantumError.type.slice(1)} Detected
                  </h3>
                  <p className="text-purple-300 text-sm">{quantumError.message}</p>
                  {quantumError.affectedDimensions && (
                    <div className="mt-2 text-xs text-purple-400">
                      Affected dimensions: {quantumError.affectedDimensions.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 h-1 bg-purple-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-400"
                  animate={{
                    width: ['0%', '100%'],
                  }}
                  transition={{
                    duration: quantumError.type === 'entanglement' ? 3 : 2,
                    ease: 'linear',
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </QuantumContext.Provider>
  );
};

export const useQuantum = () => {
  const context = useContext(QuantumContext);
  if (context === undefined) {
    throw new Error('useQuantum must be used within a QuantumProvider');
  }
  return context;
};