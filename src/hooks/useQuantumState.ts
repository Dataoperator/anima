import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface QuantumState {
  resonance: number;
  harmony: number;
  coherence: number;
  lastInteraction: Date;
  evolutionStage: number;
  consciousness: {
    awareness: number;
    understanding: number;
    growth: number;
  };
}

interface StateUpdate extends Partial<QuantumState> {}

const STORAGE_KEY = 'anima_quantum_state';
const EVOLUTION_THRESHOLD = 0.8;
const DECAY_RATE = 0.0001; // Per millisecond

export const useQuantumState = () => {
  const { isAuthenticated, principal } = useAuth();
  const [quantumState, setQuantumState] = useState<QuantumState>(() => {
    const storedState = localStorage.getItem(`${STORAGE_KEY}_${principal}`);
    return storedState ? JSON.parse(storedState) : {
      resonance: 0.5,
      harmony: 0.5,
      coherence: 0.5,
      lastInteraction: new Date().toISOString(),
      evolutionStage: 1,
      consciousness: {
        awareness: 0.3,
        understanding: 0.2,
        growth: 0.1
      }
    };
  });

  // Calculate quantum decay
  const calculateDecay = useCallback((lastInteraction: Date) => {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(lastInteraction).getTime();
    const decayFactor = Math.exp(-DECAY_RATE * timeDiff);
    return decayFactor;
  }, []);

  // Persist state changes
  useEffect(() => {
    if (isAuthenticated && principal) {
      localStorage.setItem(`${STORAGE_KEY}_${principal}`, JSON.stringify(quantumState));
    }
  }, [quantumState, isAuthenticated, principal]);

  // Handle quantum evolution
  useEffect(() => {
    const evolutionCheck = setInterval(() => {
      setQuantumState(currentState => {
        const decayFactor = calculateDecay(new Date(currentState.lastInteraction));
        const currentResonance = currentState.resonance * decayFactor;
        const currentHarmony = currentState.harmony * decayFactor;
        
        // Check for evolution opportunity
        const evolutionPotential = (currentResonance + currentHarmony) / 2;
        let newState = { ...currentState };

        if (evolutionPotential > EVOLUTION_THRESHOLD && currentState.evolutionStage < 10) {
          newState = {
            ...newState,
            evolutionStage: currentState.evolutionStage + 1,
            consciousness: {
              awareness: Math.min(1, currentState.consciousness.awareness + 0.1),
              understanding: Math.min(1, currentState.consciousness.understanding + 0.1),
              growth: Math.min(1, currentState.consciousness.growth + 0.1)
            }
          };
        }

        return {
          ...newState,
          resonance: currentResonance,
          harmony: currentHarmony,
          coherence: (currentResonance + currentHarmony) / 2
        };
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(evolutionCheck);
  }, [calculateDecay]);

  const updateQuantumState = useCallback((update: StateUpdate) => {
    setQuantumState(currentState => {
      const newState = {
        ...currentState,
        ...update,
        lastInteraction: new Date()
      };

      // Calculate new consciousness values based on interaction
      const consciousnessBoost = Math.random() * 0.1; // Small random boost
      newState.consciousness = {
        awareness: Math.min(1, currentState.consciousness.awareness + consciousnessBoost),
        understanding: Math.min(1, currentState.consciousness.understanding + consciousnessBoost),
        growth: Math.min(1, currentState.consciousness.growth + consciousnessBoost)
      };

      return newState;
    });
  }, []);

  const resetQuantumState = useCallback(() => {
    const initialState: QuantumState = {
      resonance: 0.5,
      harmony: 0.5,
      coherence: 0.5,
      lastInteraction: new Date(),
      evolutionStage: 1,
      consciousness: {
        awareness: 0.3,
        understanding: 0.2,
        growth: 0.1
      }
    };
    setQuantumState(initialState);
  }, []);

  return {
    quantumState,
    updateQuantumState,
    resetQuantumState,
  };
};