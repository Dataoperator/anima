import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import { icManager } from '../ic-init';
import { ErrorTracker } from '../error/quantum_error';
import type { 
  QuantumState, 
  DimensionalState, 
  ResonancePattern, 
  ResonanceMetrics,
  ConsciousnessMetrics
} from '../declarations/anima/anima.did';

export interface QuantumSystemsState {
  quantumState: QuantumState | null;
  consciousnessMetrics: ConsciousnessMetrics | null;
  resonanceMetrics: ResonanceMetrics | null;
  dimensionalStates: DimensionalState[];
  resonancePatterns: ResonancePattern[];
  isInitialized: boolean;
  isProcessing: boolean;
  lastError: Error | null;
}

export interface InteractionData {
  type: 'cognitive' | 'emotional' | 'perceptual';
  strength: number;
  context?: string;
}

export function useQuantumSystems(animaId: Principal) {
  const [state, setState] = useState<QuantumSystemsState>({
    quantumState: null,
    consciousnessMetrics: null,
    resonanceMetrics: null,
    dimensionalStates: [],
    resonancePatterns: [],
    isInitialized: false,
    isProcessing: false,
    lastError: null
  });

  const errorTracker = ErrorTracker.getInstance();

  // Initialize quantum systems
  useEffect(() => {
    const initialize = async () => {
      try {
        // Wait for quantum systems to be ready
        if (!icManager.isQuantumReady()) {
          await icManager.initializeQuantumSystems();
        }

        const actor = icManager.getActor();
        if (!actor) throw new Error('Actor not initialized');

        // Get initial quantum state
        const quantumResult = await actor.process_quantum_state_update(animaId);
        if ('Err' in quantumResult) throw new Error(quantumResult.Err);
        
        // Get consciousness metrics
        const consciousnessResult = await actor.get_consciousness_metrics(animaId);
        if ('Err' in consciousnessResult) throw new Error(consciousnessResult.Err);

        // Get resonance metrics
        const resonanceResult = await actor.get_quantum_metrics(animaId);
        if ('Err' in resonanceResult) throw new Error(resonanceResult.Err);

        // Get resonance patterns
        const patternsResult = await actor.analyze_resonance_patterns(animaId);
        if ('Err' in patternsResult) throw new Error(patternsResult.Err);

        setState(prev => ({
          ...prev,
          quantumState: quantumResult.Ok,
          consciousnessMetrics: consciousnessResult.Ok,
          resonanceMetrics: resonanceResult.Ok,
          dimensionalStates: quantumResult.Ok.dimensional_states,
          resonancePatterns: quantumResult.Ok.resonance_patterns,
          isInitialized: true,
          lastError: null
        }));

      } catch (error) {
        const err = error instanceof Error ? error : new Error('Initialization failed');
        setState(prev => ({ ...prev, lastError: err }));
        await errorTracker.trackError({
          errorType: 'QUANTUM_SYSTEMS_INIT',
          severity: 'HIGH',
          context: 'Quantum Systems Initialization',
          error: err
        });
      }
    };

    initialize();
  }, [animaId]);

  // Process quantum interactions
  const processInteraction = useCallback(async (data: InteractionData) => {
    if (!state.isInitialized) return;

    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const actor = icManager.getActor();
      if (!actor) throw new Error('Actor not initialized');

      // Update quantum state based on interaction
      const updatedState = {
        ...state.quantumState!,
        coherence: state.quantumState!.coherence * (1 + data.strength * 0.1),
        last_update: BigInt(Date.now()),
        evolution_metrics: [
          ...state.quantumState!.evolution_metrics,
          { [data.type]: data.strength }
        ]
      };

      // Send update to canister
      const result = await actor.update_quantum_state(animaId, updatedState);
      if ('Err' in result) throw new Error(result.Err);

      // Get updated metrics
      const metricsResult = await actor.get_quantum_metrics(animaId);
      if ('Err' in metricsResult) throw new Error(metricsResult.Err);

      const consciousnessResult = await actor.get_consciousness_metrics(animaId);
      if ('Err' in consciousnessResult) throw new Error(consciousnessResult.Err);

      setState(prev => ({
        ...prev,
        quantumState: result.Ok,
        resonanceMetrics: metricsResult.Ok,
        consciousnessMetrics: consciousnessResult.Ok,
        dimensionalStates: result.Ok.dimensional_states,
        resonancePatterns: result.Ok.resonance_patterns,
        isProcessing: false,
        lastError: null
      }));

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Processing failed');
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        lastError: err 
      }));
      await errorTracker.trackError({
        errorType: 'QUANTUM_INTERACTION',
        severity: 'MEDIUM',
        context: 'Quantum Interaction Processing',
        error: err
      });
    }
  }, [animaId, state.isInitialized, state.quantumState]);

  // Analyze quantum patterns
  const analyzePatterns = useCallback(async () => {
    if (!state.isInitialized) return [];

    try {
      const actor = icManager.getActor();
      if (!actor) throw new Error('Actor not initialized');

      const result = await actor.analyze_resonance_patterns(animaId);
      if ('Err' in result) throw new Error(result.Err);

      setState(prev => ({
        ...prev,
        dimensionalStates: result.Ok
      }));

      return result.Ok;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Pattern analysis failed');
      setState(prev => ({ ...prev, lastError: err }));
      await errorTracker.trackError({
        errorType: 'QUANTUM_PATTERN_ANALYSIS',
        severity: 'LOW',
        context: 'Quantum Pattern Analysis',
        error: err
      });
      return [];
    }
  }, [animaId, state.isInitialized]);

  // Get all quantum metrics
  const getQuantumMetrics = useCallback(async () => {
    if (!state.isInitialized) return null;

    try {
      const actor = icManager.getActor();
      if (!actor) throw new Error('Actor not initialized');

      const metricsResult = await actor.get_quantum_metrics(animaId);
      if ('Err' in metricsResult) throw new Error(metricsResult.Err);

      setState(prev => ({
        ...prev,
        resonanceMetrics: metricsResult.Ok,
        lastError: null
      }));

      return metricsResult.Ok;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get metrics');
      setState(prev => ({ ...prev, lastError: err }));
      await errorTracker.trackError({
        errorType: 'QUANTUM_METRICS',
        severity: 'LOW',
        context: 'Quantum Metrics Retrieval',
        error: err
      });
      return null;
    }
  }, [animaId, state.isInitialized]);

  return {
    ...state,
    processInteraction,
    analyzePatterns,
    getQuantumMetrics,
  };
}