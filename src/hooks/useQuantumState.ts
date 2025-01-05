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
const DECAY_RATE = 0.0001;
const MIN_COHERENCE = 0.1;
const MAX_COHERENCE = 1.0;

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

  const validateState = useCallback((state: Partial<QuantumState>): boolean => {
    if (!state || typeof state !== 'object') return false;

    if ('resonance' in state && (typeof state.resonance !== 'number' || 
        state.resonance < 0 || state.resonance > 1)) return false;
    
    if ('harmony' in state && (typeof state.harmony !== 'number' || 
        state.harmony < 0 || state.harmony > 1)) return false;
    
    if ('coherence' in state && (typeof state.coherence !== 'number' || 
        state.coherence < MIN_COHERENCE || state.coherence > MAX_COHERENCE)) return false;

    if (state.consciousness) {
      const { awareness, understanding, growth } = state.consciousness;
      if (typeof awareness !== 'number' || awareness < 0 || awareness > 1) return false;
      if (typeof understanding !== 'number' || understanding < 0 || understanding > 1) return false;
      if (typeof growth !== 'number' || growth < 0 || growth > 1) return false;
    }

    if ('evolutionStage' in state && (typeof state.evolutionStage !== 'number' || 
        state.evolutionStage < 1 || state.evolutionStage > 10)) return false;

    if (state.lastInteraction) {
      const date = new Date(state.lastInteraction);
      if (isNaN(date.getTime())) return false;
    }

    return true;
  }, []);

  const calculateDecay = useCallback((lastInteraction: Date) => {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(lastInteraction).getTime();
    const decayFactor = Math.exp(-DECAY_RATE * timeDiff);
    return Math.max(MIN_COHERENCE, Math.min(MAX_COHERENCE, decayFactor));
  }, []);

  useEffect(() => {
    if (isAuthenticated && principal && validateState(quantumState)) {
      localStorage.setItem(`${STORAGE_KEY}_${principal}`, JSON.stringify(quantumState));
    }
  }, [quantumState, isAuthenticated, principal, validateState]);

  useEffect(() => {
    const evolutionCheck = setInterval(() => {
      setQuantumState(currentState => {
        try {
          const decayFactor = calculateDecay(new Date(currentState.lastInteraction));
          const currentResonance = Math.max(MIN_COHERENCE, currentState.resonance * decayFactor);
          const currentHarmony = Math.max(MIN_COHERENCE, currentState.harmony * decayFactor);
          
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

          const finalState = {
            ...newState,
            resonance: currentResonance,
            harmony: currentHarmony,
            coherence: Math.max(MIN_COHERENCE, (currentResonance + currentHarmony) / 2)
          };

          if (!validateState(finalState)) {
            throw new Error('Invalid quantum state evolution');
          }

          return finalState;
        } catch (error) {
          console.error('Quantum evolution error:', error);
          return currentState;
        }
      });
    }, 5000);

    return () => clearInterval(evolutionCheck);
  }, [calculateDecay, validateState]);

  const updateQuantumState = useCallback(async (update: StateUpdate) => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (!validateState(update)) {
          throw new Error('Invalid quantum state update');
        }

        setQuantumState(currentState => {
          const newState = {
            ...currentState,
            ...update,
            lastInteraction: new Date()
          };

          const consciousnessBoost = Math.random() * 0.1;
          newState.consciousness = {
            awareness: Math.min(1, currentState.consciousness.awareness + consciousnessBoost),
            understanding: Math.min(1, currentState.consciousness.understanding + consciousnessBoost),
            growth: Math.min(1, currentState.consciousness.growth + consciousnessBoost)
          };

          if (!validateState(newState)) {
            throw new Error('Invalid quantum state after consciousness update');
          }

          return newState;
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }, [validateState]);

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

    if (validateState(initialState)) {
      setQuantumState(initialState);
    }
  }, [validateState]);

  return {
    quantumState,
    updateQuantumState,
    resetQuantumState,
    validateState,
  };
};