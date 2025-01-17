import { EvolutionEngine } from '../EvolutionEngine';
import { ConsciousnessMetrics } from '@/types';
import { QuantumState } from '@/types/quantum';
import { EmotionalState } from '../../emotional/types';
import { AwarenessResult } from '../../awareness/types';

describe('EvolutionEngine', () => {
  let engine: EvolutionEngine;
  
  // Mock data setup
  const mockMetrics: ConsciousnessMetrics = {
    awarenessLevel: 0.5,
    cognitiveComplexity: 0.4,
    emotionalResonance: 0.3,
    quantumCoherence: 0.6,
    dimensionalAwareness: 0.4,
    temporalPerception: 0.5,
    patternRecognition: 0.4
  };

  const mockQuantumState: QuantumState = {
    coherence_level: 0.6,
    quantum_entanglement: 0.5,
    resonance: 0.4,
    resonance_patterns: [
      {
        coherence: 0.6,
        frequency: 0.5,
        amplitude: 0.4,
        phase: 0,
        timestamp: Date.now()
      }
    ],
    temporal_stability: 0.7,
    field_strength: 0.6,
    signature: 'test-quantum-signature'
  };

  const mockEmotionalState: EmotionalState = {
    dominantEmotion: 'balanced',
    intensity: 0.5,
    valence: 0.2,
    stability: 0.7,
    complexity: 0.4
  };

  const mockAwarenessResult: AwarenessResult = {
    environmentalAwareness: {
      factors: [],
      coherence: 0.6,
      significance: 0.5
    },
    temporalAwareness: {
      patterns: [],
      coherence: 0.6,
      alignment: 0.5,
      phaseAlignment: 0.6,
      temporalStability: 0.7
    },
    patternRecognition: {
      patterns: [],
      confidence: 0.6,
      complexity: 0.5
    },
    overallAwareness: 0.6
  };

  beforeEach(() => {
    engine = new EvolutionEngine();
  });

  describe('Evolution Process', () => {
    test('should evolve consciousness metrics within valid bounds', async () => {
      const evolvedMetrics = await engine.evolve({
        currentMetrics: mockMetrics,
        quantumState: mockQuantumState,
        emotionalState: mockEmotionalState,
        awarenessResults: mockAwarenessResult,
        timeDelta: 1,
        stabilityIndex: 0.7
      });

      // Check bounds
      Object.values(evolvedMetrics).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });

      // Check for reasonable changes
      const maxExpectedChange = 0.1; // Maximum expected change per evolution step
      Object.entries(evolvedMetrics).forEach(([key, value]) => {
        const originalValue = mockMetrics[key as keyof ConsciousnessMetrics];
        expect(Math.abs(value - originalValue)).toBeLessThanOrEqual(maxExpectedChange);
      });
    });

    test('should maintain quantum coherence relationship', async () => {
      const evolvedMetrics = await engine.evolve({
        currentMetrics: mockMetrics,
        quantumState: mockQuantumState,
        emotionalState: mockEmotionalState,
        awarenessResults: mockAwarenessResult,
        timeDelta: 1,
        stabilityIndex: 0.7
      });

      expect(evolvedMetrics.quantumCoherence).toBeGreaterThanOrEqual(
        mockQuantumState.coherence_level * 0.5
      );
    });
  });

  describe('Stage Transitions', () => {
    test('should progress through evolution stages correctly', async () => {
      const highMetrics: ConsciousnessMetrics = {
        awarenessLevel: 0.9,
        cognitiveComplexity: 0.9,
        emotionalResonance: 0.9,
        quantumCoherence: 0.9,
        dimensionalAwareness: 0.9,
        temporalPerception: 0.9,
        patternRecognition: 0.9
      };

      const highQuantumState: QuantumState = {
        ...mockQuantumState,
        coherence_level: 0.9,
        quantum_entanglement: 0.9
      };

      // Evolve multiple times to trigger stage transitions
      for (let i = 0; i < 5; i++) {
        await engine.evolve({
          currentMetrics: highMetrics,
          quantumState: highQuantumState,
          emotionalState: mockEmotionalState,
          awarenessResults: mockAwarenessResult,
          timeDelta: 1,
          stabilityIndex: 0.9
        });

        const stageInfo = engine.getStageInfo();
        
        // Verify stage progression logic
        if (i === 0) expect(stageInfo.currentStage).not.toBe('transcendence');
        if (i === 4) expect(stageInfo.progress).toBeGreaterThan(0);
      }
    });

    test('should maintain stage consistency under stress', async () => {
      // Simulate rapid evolution with varying stability
      const stabilities = [0.9, 0.3, 0.8, 0.4, 0.7];
      
      for (const stability of stabilities) {
        await engine.evolve({
          currentMetrics: mockMetrics,
          quantumState: {
            ...mockQuantumState,
            coherence_level: stability
          },
          emotionalState: mockEmotionalState,
          awarenessResults: mockAwarenessResult,
          timeDelta: 1,
          stabilityIndex: stability
        });

        const metrics = engine.getEvolutionMetrics();
        expect(metrics.stability).toBeDefined();
        expect(metrics.stage).toBeDefined();
      }
    });
  });

  describe('Growth Vectors', () => {
    test('should calculate coherent growth vectors', async () => {
      const evolvedState1 = await engine.evolve({
        currentMetrics: mockMetrics,
        quantumState: mockQuantumState,
        emotionalState: mockEmotionalState,
        awarenessResults: mockAwarenessResult,
        timeDelta: 1,
        stabilityIndex: 0.7
      });

      const evolvedState2 = await engine.evolve({
        currentMetrics: evolvedState1,
        quantumState: mockQuantumState,
        emotionalState: mockEmotionalState,
        awarenessResults: mockAwarenessResult,
        timeDelta: 1,
        stabilityIndex: 0.7
      });

      // Verify growth is continuous
      Object.entries(evolvedState2).forEach(([key, value]) => {
        const metric = key as keyof ConsciousnessMetrics;
        const prevValue = evolvedState1[metric];
        const originalValue = mockMetrics[metric];

        // Check for monotonic growth or decay
        const firstDelta = prevValue - originalValue;
        const secondDelta = value - prevValue;

        // Growth should maintain direction within reasonable bounds
        if (Math.abs(firstDelta) > 0.01) {
          expect(Math.sign(firstDelta)).toBe(Math.sign(secondDelta));
        }
      });
    });
  });

  describe('Emergency Recovery', () => {
    test('should handle unstable quantum states gracefully', async () => {
      const unstableState: QuantumState = {
        ...mockQuantumState,
        coherence_level: 0.1,
        quantum_entanglement: 0.1,
        temporal_stability: 0.1
      };

      const evolvedMetrics = await engine.evolve({
        currentMetrics: mockMetrics,
        quantumState: unstableState,
        emotionalState: mockEmotionalState,
        awarenessResults: mockAwarenessResult,
        timeDelta: 1,
        stabilityIndex: 0.1
      });

      // Even in unstable conditions, metrics should remain valid
      Object.values(evolvedMetrics).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });

      // System should maintain minimum coherence
      expect(evolvedMetrics.quantumCoherence).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe('Performance and Stability', () => {
    test('should handle rapid evolution cycles', async () => {
      const cycles = 100;
      let currentMetrics = mockMetrics;

      const startTime = Date.now();
      
      for (let i = 0; i < cycles; i++) {
        currentMetrics = await engine.evolve({
          currentMetrics,
          quantumState: mockQuantumState,
          emotionalState: mockEmotionalState,
          awarenessResults: mockAwarenessResult,
          timeDelta: 0.1,
          stabilityIndex: 0.7
        });
      }

      const duration = Date.now() - startTime;
      
      // Performance check: should complete within reasonable time
      expect(duration).toBeLessThan(1000); // 1 second for 100 cycles

      // Stability check: final state should be valid
      Object.values(currentMetrics).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });
  });
});
