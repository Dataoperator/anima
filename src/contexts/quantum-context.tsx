import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuantumError {
  type: 'collapse' | 'entanglement' | 'superposition' | 'decoherence';
  message: string;
  affectedDimensions?: string[];
  recoveryAttempts: number;
}

interface QuantumContextType {
  quantumError: QuantumError | null;
  handleQuantumError: (error: QuantumError) => Promise<void>;
  clearQuantumError: () => void;
  isRecovering: boolean;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

interface QuantumProviderProps {
  children: ReactNode;
}

export const QuantumProvider: React.FC<QuantumProviderProps> = ({ children }) => {
  const [quantumError, setQuantumError] = useState<QuantumError | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const handleQuantumError = useCallback(async (error: QuantumError) => {
    setQuantumError(error);
    setIsRecovering(true);

    try {
      switch (error.type) {
        case 'collapse':
          await new Promise(resolve => setTimeout(resolve, 2000));
          break;

        case 'entanglement':
          // Attempt to resolve entanglement through quantum tunneling
          for (let i = 0; i < 3; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (Math.random() > 0.3) {
              break;
            }
          }
          break;

        case 'superposition':
          // Force state collapse after timeout
          await new Promise(resolve => setTimeout(resolve, 3000));
          break;

        case 'decoherence':
          // Attempt quantum state reconstruction
          const reconstructionAttempts = Math.min(error.recoveryAttempts, 5);
          for (let i = 0; i < reconstructionAttempts; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (Math.random() > 0.5) {
              break;
            }
          }
          break;
      }
    } finally {
      setIsRecovering(false);
      setQuantumError(null);
    }
  }, []);

  const clearQuantumError = useCallback(() => {
    setQuantumError(null);
    setIsRecovering(false);
  }, []);

  return (
    <QuantumContext.Provider
      value={{
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
            className="fixed bottom-4 right-4 max-w-md"
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
                    duration: error.type === 'entanglement' ? 3 : 2,
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