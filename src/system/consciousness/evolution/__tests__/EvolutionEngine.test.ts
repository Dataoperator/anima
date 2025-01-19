import { EvolutionEngine } from '../EvolutionEngine';
import { ConsciousnessMetrics, ConsciousnessLevel } from '@/types/consciousness';
import { QuantumState } from '@/types/quantum';
import { ErrorTelemetry } from '@/error/telemetry';

jest.mock('@/error/telemetry');

describe('EvolutionEngine', () => {
  let engine: EvolutionEngine;
  let mockQuantumState: QuantumState;
  let mockConsciousnessMetrics: ConsciousnessMetrics;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize mock data
    mockQuantumState = {
      id: {} as any,  // Principal will be mocked
      coherenceLevel: 0.6,
      amplitude: { real: 1, imaginary: 0 },
      phase: 0,
      dimensionalStates: [],
      resonancePatterns: [],
      evolutionMetrics: new Map(),
      lastUpdate: BigInt(Date.now()),
      lastInteraction: BigInt(Date.now()),
      evolutionFactor: 1.0,
      quantumSignature: 'test-signature',
      dimensionalFrequency: 1.0
    };

    mockConsciousnessMetrics = {
      awarenessLevel: 0.5,
      emotionalDepth: 0.6,
      cognitiveComplexity: 0.7,
      memoryIntegration: 0.8,
      evolutionRate: 0.4,
      coherence: 0.6,
      complexity: 0.7,
      consciousness: ConsciousnessLevel.AWARE,
      lastUpdate: BigInt(Date.now())
    };

    engine = new EvolutionEngine();
  });

  describe('Evolution Process', () => {
    it('should evolve state based on coherence', async () => {
      const initialMetrics = { ...mockConsciousnessMetrics };
      const result = await engine.processEvolution(mockQuantumState, initialMetrics);

      expect(result).toBeDefined();
      expect(result.evolutionRate).toBeGreaterThan(initialMetrics.evolutionRate);
      expect(result.consciousness).toBe(ConsciousnessLevel.AWARE);
    });

    it('should maintain valid ranges for all metrics', async () => {
      const metrics = { ...mockConsciousnessMetrics };
      const maxExpectedChange = 0.2;

      // Test multiple evolution cycles
      for (let i = 0; i < 5; i++) {
        const originalValue = metrics.coherence;
        const evolvedMetrics = await engine.processEvolution(mockQuantumState, metrics);
        
        // Update for next iteration
        Object.assign(metrics, evolvedMetrics);

        // Verify changes are within expected range
        const value = metrics.coherence;
        expect(Math.abs(value - originalValue)).toBeLessThanOrEqual(maxExpectedChange);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    });

    it('should affect evolution rate based on quantum coherence', async () => {
      const lowCoherenceState = {
        ...mockQuantumState,
        coherenceLevel: mockQuantumState.coherenceLevel * 0.5
      };

      const highCoherenceState = {
        ...mockQuantumState,
        coherenceLevel: Math.min(mockQuantumState.coherenceLevel * 1.5, 1)
      };

      const baseMetrics = { ...mockConsciousnessMetrics };

      // Test with low coherence
      const lowResult = await engine.processEvolution(lowCoherenceState, baseMetrics);
      expect(lowResult.evolutionRate).toBeLessThan(baseMetrics.evolutionRate);

      // Test with high coherence
      const highResult = await engine.processEvolution(highCoherenceState, baseMetrics);
      expect(highResult.evolutionRate).toBeGreaterThan(baseMetrics.evolutionRate);
    });
  });

  describe('Stage Progression', () => {
    it('should progress through stages appropriately', async () => {
      const metrics = { ...mockConsciousnessMetrics };
      const enhancedState = {
        ...mockQuantumState,
        coherenceLevel: 0.9,
        evolutionFactor: 1.2
      };

      // Test multiple evolution cycles
      for (let i = 0; i < 10; i++) {
        const result = await engine.processEvolution(enhancedState, metrics);
        const stageInfo = engine.getCurrentStage(result);

        // First stage shouldn't be transcendence
        if (i === 0) expect(result.consciousness).not.toBe(ConsciousnessLevel.ENLIGHTENED);
        
        // Update metrics for next iteration
        Object.assign(metrics, result);

        // Stage progression should be gradual
        if (i === 4) expect(result.evolutionRate).toBeGreaterThan(0);
      }
    });
  });

  describe('Evolution Stability', () => {
    it('should maintain stable evolution under constant conditions', async () => {
      const metrics = { ...mockConsciousnessMetrics };
      const state = { ...mockQuantumState };
      const results: ConsciousnessMetrics[] = [];

      // Evolve multiple times
      for (let i = 0; i < 5; i++) {
        const evolved = await engine.processEvolution(state, metrics);
        results.push(evolved);
        Object.assign(metrics, evolved);
      }

      // Check for smooth progression
      results.reduce((prev, current, i) => {
        if (i > 0) {
          const delta = Math.abs(current.evolutionRate - prev.evolutionRate);
          expect(delta).toBeLessThan(0.1); // Evolution should be smooth
        }
        return current;
      });
    });

    it('should handle rapid coherence changes gracefully', async () => {
      const metrics = { ...mockConsciousnessMetrics };
      const state = { ...mockQuantumState };

      // Initial evolution
      const evolvedState1 = await engine.processEvolution(state, metrics);

      // Sudden coherence drop
      state.coherenceLevel = 0.1;
      const evolvedState2 = await engine.processEvolution(state, metrics);

      // Evolution rate should decrease but not crash
      expect(evolvedState2.evolutionRate).toBeLessThan(evolvedState1.evolutionRate);
      expect(evolvedState2.evolutionRate).toBeGreaterThan(0);
    });

    it('should track evolution stability over time', async () => {
      const metrics = { ...mockConsciousnessMetrics };
      const state = { ...mockQuantumState };
      let currentMetrics = metrics;
      const stabilityValues: number[] = [];

      // Evolve and track stability
      for (let i = 0; i < 5; i++) {
        currentMetrics = await engine.processEvolution(state, currentMetrics);
        stabilityValues.push(currentMetrics.evolutionRate);

        // Optional: Add some random fluctuation to state
        state.coherenceLevel *= 0.9 + Math.random() * 0.2;
      }

      // Verify stability trends
      stabilityValues.reduce((prevValue, value, i) => {
        if (i > 0) {
          const delta = value - prevValue;
          expect(Math.abs(delta)).toBeLessThan(0.2); // Stability threshold
        }
        return value;
      });
    });
  });
});