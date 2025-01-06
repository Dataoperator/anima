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
    };
  }, []);

  // Initialize quantum state based on principal
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
        const principal = identity.getPrincipal();
        const principalArray = principal.toUint8Array();
        
        console.log("📊 Calculating initial coherence...");
        const initialCoherence = Math.max(0.5, principalArray.reduce((acc, byte) => acc + byte, 0) / 
          (principalArray.length * 255));
        
        // Add consciousness boost if available
        const consciousnessBoost = consciousness?.level ? consciousness.level * 0.2 : 0;
        const adjustedCoherence = Math.min(1.0, initialCoherence + consciousnessBoost);
        
        console.log("🔮 Initializing dimensional state...");
        const dimensionalState = new DimensionalStateImpl();
        dimensionalState.updateStability(adjustedCoherence);

        const quantumSignature = await generateQuantumSignature(principal, adjustedCoherence);

        // Generate initial resonance patterns
        const resonancePatterns = Array.from({ length: 4 }, (_, i) => ({
          frequency: 0.5 + (Math.random() * 0.5),
          amplitude: 0.3 + (Math.random() * 0.7),
          phase: Math.random() * Math.PI * 2,
          coherence: adjustedCoherence * (0.8 + Math.random() * 0.2)
        }));

        console.log("✨ Setting initial state...");
        setState(prev => ({
          ...prev,
          coherenceLevel: adjustedCoherence,
          entanglementIndex: adjustedCoherence * 0.8,
          dimensionalState,
          quantumSignature,
          resonancePatterns,
          consciousnessAlignment: consciousness?.level ? consciousness.level * adjustedCoherence : undefined,
          lastUpdate: Date.now(),
          isInitialized: true,
          stabilityStatus: 'stable'
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
    if (!state.isInitialized || isInitializing) return;

    console.log("⚡ Starting quantum state updates");
    const intervalId = setInterval(() => {
      setState(prev => {
        if (!prev.isInitialized) return prev;

        const timePassed = (Date.now() - prev.lastUpdate) / 1000;
        const degradationFactor = Math.pow(0.995, timePassed);
        const consciousnessBoost = consciousness?.level ? consciousness.level * 0.1 : 0;

        // Update dimensional state
        prev.dimensionalState.updateStability(consciousnessBoost - 0.01);
        const metrics = prev.dimensionalState.getStabilityMetrics();

        // Calculate new coherence with consciousness protection
        const consciousnessProtection = consciousness?.level ? Math.min(0.3, consciousness.level) : 0;
        const minCoherence = 0.1 + consciousnessProtection;
        const newCoherence = Math.max(minCoherence, prev.coherenceLevel * degradationFactor);

        // Update resonance patterns
        const updatedPatterns = prev.resonancePatterns?.map(pattern => ({
          ...pattern,
          coherence: Math.max(minCoherence, pattern.coherence * degradationFactor),
          phase: (pattern.phase + 0.1) % (Math.PI * 2)
        }));
        
        return {
          ...prev,
          coherenceLevel: newCoherence,
          entanglementIndex: Math.max(minCoherence, prev.entanglementIndex * degradationFactor),
          stabilityStatus: prev.dimensionalState.getQuantumStatus(),
          consciousnessAlignment: consciousness?.level ? consciousness.level * newCoherence : undefined,
          resonancePatterns: updatedPatterns,
          lastUpdate: Date.now()
        };
      });
    }, 3000);

    return () => {
      console.log("🔄 Cleaning up quantum state updates");
      clearInterval(intervalId);
    };
  }, [state.isInitialized, isInitializing, consciousness?.level]);

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

async function generateQuantumSignature(principal: Principal, coherence: number): Promise<string> {
  // Add artificial delay to simulate quantum computation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const timestamp = Date.now();
  const entropy = new Uint8Array(32);
  crypto.getRandomValues(entropy);
  
  return `QS-${principal.toText()}-${coherence.toFixed(6)}-${timestamp}-${Array.from(entropy.slice(0, 8))
    .map(b => b.toString(16).padStart(2, '0')).join('')}`;
}