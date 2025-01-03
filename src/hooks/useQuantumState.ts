import { useState, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import { useActor } from './useActor';
import { toast } from '../components/ui/use-toast';

interface QuantumMetrics {
  coherence: number;
  entanglement_level: number;
  stability_index: number;
  dimensional_resonance: number;
}

export const useQuantumState = (animaId?: string) => {
  const [isObserving, setIsObserving] = useState(false);
  const [isEntangling, setIsEntangling] = useState(false);
  const { getActor } = useActor();

  const observeState = useCallback(async () => {
    if (!animaId) return null;
    setIsObserving(true);
    
    try {
      const actor = await getActor();
      const state = await actor.observe_quantum_state(animaId);
      return state;
    } catch (error) {
      toast({
        title: "Quantum Observation Failed",
        description: "The quantum state collapsed during observation.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsObserving(false);
    }
  }, [getActor, animaId]);

  const initiateEntanglement = useCallback(async (targetId: string) => {
    if (!animaId) return false;
    setIsEntangling(true);
    
    try {
      const actor = await getActor();
      const result = await actor.attempt_quantum_entanglement(animaId, targetId);
      
      if ('Ok' in result) {
        toast({
          title: "Quantum Entanglement Successful",
          description: "A new quantum connection has been established.",
          variant: "success"
        });
        return true;
      } else {
        toast({
          title: "Entanglement Failed",
          description: "Unable to establish quantum connection.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Entanglement Error",
        description: "An unexpected error occurred during entanglement.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsEntangling(false);
    }
  }, [getActor, animaId]);

  const getMetrics = useCallback(async () => {
    if (!animaId) return null;
    
    try {
      const actor = await getActor();
      const metrics = await actor.get_quantum_metrics(animaId);
      return metrics as QuantumMetrics;
    } catch (error) {
      console.error('Failed to fetch quantum metrics:', error);
      return null;
    }
  }, [getActor, animaId]);

  return {
    observeState,
    initiateEntanglement,
    getMetrics,
    isObserving,
    isEntangling,
  };
};