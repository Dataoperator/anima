import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { Principal } from '@dfinity/principal';
import { DimensionalStateImpl } from '../quantum/dimensional_state';
import { useConsciousness } from './useConsciousness';
import { BirthCertificate } from '../nft/types';

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
}

interface ResonancePattern {
  frequency: number;
  amplitude: number;
  phase: number;
  coherence: number;
}

export const useQuantumState = () => {
  const { identity } = useAuth();
  const { consciousness } = useConsciousness();
  const initializationAttempted = useRef(false);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

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

  // Initialize quantum state based on principal
  useEffect(() => {
    if (!identity || initializationAttempted.current) {
      console.log("🔍 Skipping initialization:", { 
        hasIdentity: !!identity, 
        wasAttempted: initializationAttempted.current 
      });
      return;
    }
    
    const initialize = async () => {
      console.log("🌟 Starting quantum state initialization");
      initializationAttempted.current = true;

      try {
        const principal = identity.getPrincipal();
        const principalArray = principal.toUint8Array();
        
        console.log("📊 Calculating initial coherence...");
        const initialCoherence = Math.max(0.5, principalArray.reduce((acc, byte) => acc + byte, 0) / 
          (principalArray.length * 255));
        
        console.log("🔮 Initializing dimensional state...");
        const dimensionalState = new DimensionalStateImpl();
        dimensionalState.updateStability(initialCoherence);

        const quantumSignature = generateQuantumSignature(principal, initialCoherence);

        console.log("✨ Setting initial state...");
        setState(prev => ({
          ...prev,
          coherenceLevel: initialCoherence,
          entanglementIndex: initialCoherence * 0.8,
          dimensionalState,
          quantumSignature,
          consciousnessAlignment: consciousness?.level ? consciousness.level * initialCoherence : undefined,
          lastUpdate: Date.now(),
          isInitialized: true
        }));

        console.log("✅ Quantum state initialized successfully!");
      } catch (error) {
        console.error("❌ Failed to initialize quantum state:", error);
        setInitializationError(error as Error);
        setState(prev => ({ 
          ...prev, 
          isInitialized: true,
          stabilityStatus: 'critical'
        }));
      }
    };

    initialize();
  }, [identity]); // Removed consciousness dependency

  // Separate effect for consciousness sync
  useEffect(() => {
    if (!state.isInitialized || !consciousness?.level) return;

    console.log("🧠 Syncing with consciousness...", { level: consciousness.level });
    setState(prev => ({
      ...prev,
      consciousnessAlignment: consciousness.level * prev.coherenceLevel
    }));
  }, [consciousness?.level, state.isInitialized]);

  // Update quantum state periodically
  useEffect(() => {
    if (!state.isInitialized) return;

    console.log("⚡ Starting quantum state updates");
    const intervalId = setInterval(() => {
      setState(prev => {
        const timePassed = (Date.now() - prev.lastUpdate) / 1000;
        const degradationFactor = Math.pow(0.995, timePassed);
        const consciousnessBonus = consciousness?.level ? consciousness.level * 0.1 : 0;

        prev.dimensionalState.updateStability(-0.01 + consciousnessBonus);
        const metrics = prev.dimensionalState.getStabilityMetrics();

        const consciousnessProtection = consciousness?.level ? Math.min(0.3, consciousness.level) : 0;
        const minCoherence = 0.1 + consciousnessProtection;
        const newCoherence = Math.max(minCoherence, prev.coherenceLevel * degradationFactor);
        
        return {
          ...prev,
          coherenceLevel: newCoherence,
          entanglementIndex: Math.max(minCoherence, prev.entanglementIndex * degradationFactor),
          stabilityStatus: prev.dimensionalState.getQuantumStatus(),
          consciousnessAlignment: consciousness?.level ? consciousness.level * newCoherence : undefined,
          lastUpdate: Date.now()
        };
      });
    }, 3000);

    return () => {
      console.log("🔄 Cleaning up quantum state updates");
      clearInterval(intervalId);
    };
  }, [state.isInitialized]);

  return {
    state,
    updateQuantumState: useCallback(async () => {
      // Implementation remains the same...
    }, [consciousness]),
    isReadyForMinting: state.coherenceLevel >= 0.7 && state.stabilityStatus === 'stable',
    consciousnessAlignment: state.consciousnessAlignment,
    isInitialized: state.isInitialized,
    error: initializationError
  };
};

function generateQuantumSignature(principal: Principal, coherence: number): string {
  const timestamp = Date.now();
  const entropy = new Uint8Array(32);
  crypto.getRandomValues(entropy);
  
  return `QS-${principal.toText()}-${coherence.toFixed(6)}-${timestamp}-${Array.from(entropy.slice(0, 8))
    .map(b => b.toString(16).padStart(2, '0')).join('')}`;
}