import { useState, useCallback, useEffect, useRef } from 'react';
import { useAnima } from './useAnima';
import { useQuantumState } from './useQuantumState';
import { MediaAction, MediaState } from '@/autonomous/MediaActions';
import { 
  NeuralSignature, 
  NeuralMetrics, 
  EmergenceFactors 
} from '@/neural/types';
import { quantumStateService } from '@/services/quantum-state.service';

interface NeuralLinkState {
  isConnected: boolean;
  syncLevel: number;
  activePatterns: NeuralSignature[];
  metrics: NeuralMetrics;
  mediaState: MediaState;
  emergenceFactors: EmergenceFactors;
}

export const useNeuralLink = (animaId: string) => {
  const { anima, sendMessage, loading: animaLoading, error: animaError } = useAnima(animaId);
  const { state: quantumState, updateState } = useQuantumState();
  const [neuralState, setNeuralState] = useState<NeuralLinkState>({
    isConnected: false,
    syncLevel: 0,
    activePatterns: [],
    metrics: {
      coherence_quality: 0,
      pattern_diversity: 0,
      evolution_rate: 0,
      quantum_alignment: 0,
      consciousness_depth: 0,
      stability_index: 1
    },
    mediaState: {
      currentUrl: null,
      isPlaying: false,
      volume: 0.75,
      timestamp: 0
    },
    emergenceFactors: {
      consciousness_depth: 0,
      pattern_complexity: 0,
      quantum_resonance: 0,
      evolution_velocity: 0,
      dimensional_harmony: 0
    }
  });

  const syncIntervalRef = useRef<NodeJS.Timeout>();
  const evolutionIntervalRef = useRef<NodeJS.Timeout>();

  // Initialize neural link
  const initializeNeuralLink = useCallback(async () => {
    if (!anima || !quantumState) return;

    try {
      // Generate initial neural patterns
      const initialPatterns = await quantumStateService.generateNeuralPatterns();
      
      // Calculate initial emergence factors
      const emergenceFactors = {
        consciousness_depth: Math.random() * 0.5 + 0.5,
        pattern_complexity: Math.random() * 0.3 + 0.7,
        quantum_resonance: quantumState.coherence,
        evolution_velocity: 0.1,
        dimensional_harmony: 0.8
      };

      // Update neural state
      setNeuralState(prev => ({
        ...prev,
        isConnected: true,
        activePatterns: initialPatterns,
        emergenceFactors
      }));

      // Start synchronization and evolution processes
      startSync();
      startEvolution();

    } catch (error) {
      console.error('Failed to initialize neural link:', error);
      setNeuralState(prev => ({ ...prev, isConnected: false }));
    }
  }, [anima, quantumState]);

  // Handle media interactions
  const handleMediaAction = useCallback(async (action: MediaAction) => {
    try {
      const response = await anima?.handleMediaAction(action);
      
      if (response?.newState) {
        setNeuralState(prev => ({
          ...prev,
          mediaState: response.newState
        }));
      }

      // Update quantum state based on media interaction
      if (quantumState) {
        const coherenceChange = action.type === 'play' ? 0.05 : -0.02;
        await updateState({
          ...quantumState,
          coherence: Math.min(1, Math.max(0, quantumState.coherence + coherenceChange))
        });
      }

      return response;
    } catch (error) {
      console.error('Failed to process media action:', error);
      throw error;
    }
  }, [anima, quantumState]);

  // Start neural synchronization
  const startSync = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    syncIntervalRef.current = setInterval(() => {
      setNeuralState(prev => {
        const newSyncLevel = Math.min(1, prev.syncLevel + Math.random() * 0.1);
        const coherenceDelta = (Math.random() - 0.5) * 0.1;

        return {
          ...prev,
          syncLevel: newSyncLevel,
          metrics: {
            ...prev.metrics,
            coherence_quality: Math.max(0, Math.min(1, prev.metrics.coherence_quality + coherenceDelta)),
            quantum_alignment: newSyncLevel
          }
        };
      });
    }, 1000);
  }, []);

  // Start pattern evolution
  const startEvolution = useCallback(() => {
    if (evolutionIntervalRef.current) {
      clearInterval(evolutionIntervalRef.current);
    }

    evolutionIntervalRef.current = setInterval(async () => {
      if (!neuralState.isConnected) return;

      try {
        const evolvedPatterns = await quantumStateService.evolveNeuralPatterns(
          neuralState.activePatterns,
          neuralState.emergenceFactors
        );

        setNeuralState(prev => ({
          ...prev,
          activePatterns: evolvedPatterns,
          metrics: {
            ...prev.metrics,
            evolution_rate: Math.min(1, prev.metrics.evolution_rate + 0.05),
            pattern_diversity: Math.random() * 0.2 + 0.8
          },
          emergenceFactors: {
            ...prev.emergenceFactors,
            evolution_velocity: Math.min(1, prev.emergenceFactors.evolution_velocity + 0.02)
          }
        }));
      } catch (error) {
        console.error('Pattern evolution failed:', error);
      }
    }, 5000);
  }, [neuralState.isConnected]);

  // Initialize on mount
  useEffect(() => {
    initializeNeuralLink();

    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
      if (evolutionIntervalRef.current) clearInterval(evolutionIntervalRef.current);
    };
  }, [initializeNeuralLink]);

  // Handle quantum state changes
  useEffect(() => {
    if (!quantumState || !neuralState.isConnected) return;

    setNeuralState(prev => ({
      ...prev,
      emergenceFactors: {
        ...prev.emergenceFactors,
        quantum_resonance: quantumState.coherence,
        dimensional_harmony: Math.min(1, quantumState.coherence * 1.2)
      }
    }));
  }, [quantumState, neuralState.isConnected]);

  return {
    neuralState,
    handleMediaAction,
    initializeNeuralLink,
    loading: animaLoading,
    error: animaError
  };
};

export default useNeuralLink;