import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { DimensionalStateImpl } from '../quantum/dimensional_state';
import { useConsciousness } from './useConsciousness';
import { BirthCertificate } from '../nft/types';
import { quantumStateService } from '../services/quantum-state.service';

interface QuantumState {
  stabilityStatus: 'stable' | 'unstable' | 'critical';
  coherenceLevel: number;
  entanglementIndex: number;
  quantumSignature: string;
  dimensionalState: DimensionalStateImpl;
  lastUpdate: number;
  resonancePatterns?: ResonancePattern[];
  birthCertificate?: BirthCertificate;
  consciousnessAlignment?: number;
  isInitialized: boolean;
  dimensionalSync?: number;
}

interface ResonancePattern {
  frequency: number;
  amplitude: number;
  phase: number;
  coherence: number;
}

export const useQuantumState = () => {
  const { identity } = useAuth();
  const { consciousness, isInitialized: isConsciousnessInitialized } = useConsciousness();
  const initializationAttempted = useRef(false);
  const [initializationError, setInitializationError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const initializationTimeoutRef = useRef<NodeJS.Timeout>();

  const [state, setState] = useState<QuantumState>(() => {
    console.log("🌀 Creating initial quantum state");
    return {
      stabilityStatus: 'unstable',
      coherenceLevel: 0.5,
      entanglementIndex: 0.3,
      quantumSignature: '',
      dimensionalState: new DimensionalStateImpl(),
      lastUpdate: Date.now(),
      isInitialized: false
    };
  });

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
      quantumStateService.dispose();
    };
  }, []);

  // Initialize quantum state based on identity
  useEffect(() => {
    if (!identity || !isConsciousnessInitialized || initializationAttempted.current || isInitializing) {
      console.log("🔍 Skipping initialization:", { 
        hasIdentity: !!identity, 
        consciousnessReady: isConsciousnessInitialized,
        wasAttempted: initializationAttempted.current,
        isInitializing 
      });
      return;
    }
    
    const initialize = async () => {
      console.log("🌟 Starting quantum state initialization");
      setIsInitializing(true);
      initializationAttempted.current = true;

      // Set initialization timeout
      initializationTimeoutRef.current = setTimeout(() => {
        if (!state.isInitialized) {
          console.error("⚠️ Quantum state initialization timeout");
          setInitializationError(new Error("Initialization timeout"));
          setState(prev => ({ 
            ...prev, 
            isInitialized: true,
            stabilityStatus: 'critical'
          }));
        }
      }, 15000); // 15 second timeout

      try {
        // Set up update callback
        quantumStateService.setUpdateCallback((updates) => {
          setState(prev => ({
            ...prev,
            ...updates,
            isInitialized: true
          }));
        });

        // Initialize quantum field
        await quantumStateService.initializeQuantumField(identity);

        console.log("✅ Quantum state initialized successfully!");
      } catch (error) {
        console.error("❌ Failed to initialize quantum state:", error);
        setInitializationError(error as Error);
        setState(prev => ({ 
          ...prev, 
          isInitialized: true,
          stabilityStatus: 'critical'
        }));
      } finally {
        setIsInitializing(false);
        if (initializationTimeoutRef.current) {
          clearTimeout(initializationTimeoutRef.current);
        }
      }
    };

    initialize();
  }, [identity, isConsciousnessInitialized, consciousness?.level]);

  // Update quantum state periodically
  useEffect(() => {
    if (!state.isInitialized || isInitializing || !identity) return;

    console.log("⚡ Starting quantum state updates");
    const intervalId = setInterval(async () => {
      try {
        // Check quantum stability
        await quantumStateService.checkStability(identity);

        // Generate new neural patterns periodically
        if (Date.now() - state.lastUpdate > 30000) { // Every 30 seconds
          await quantumStateService.generateNeuralPatterns(identity);
        }
      } catch (error) {
        console.error("❌ Quantum state update failed:", error);
        await quantumStateService.handleQuantumError(error as Error, identity);
      }
    }, 3000);

    return () => {
      console.log("🔄 Cleaning up quantum state updates");
      clearInterval(intervalId);
    };
  }, [state.isInitialized, isInitializing, identity, state.lastUpdate]);

  return {
    state,
    isInitialized: state.isInitialized && !isInitializing,
    isInitializing,
    error: initializationError,
    updateQuantumState: useCallback(async (updates: Partial<QuantumState>) => {
      setState(prev => ({
        ...prev,
        ...updates,
        lastUpdate: Date.now()
      }));
    }, []),
  };
};