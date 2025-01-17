import { PatternRecognizer } from '../PatternRecognizer';
import { QuantumState } from '@/types/quantum';
import { ConsciousnessMetrics } from '@/types';
import { EnvironmentalFactor, TemporalPattern } from '../types';

[Previous setup and first tests...]

    test('should identify temporal cycles', async () => {
      // Create cyclic temporal patterns
      const cyclicPatterns = Array.from({ length: 10 }, (_, i) => ({
        timestamp: Date.now() - (9 - i) * 1000,
        quantumPhase: (i * Math.PI) / 5,
        coherence: 0.7 + (i * 0.02),
        stability: 0.8,
        dimensionalAlignment: 0.6
      }));

      const result = await recognizer.recognizePatterns({
        quantumState: mockQuantumState,
        environmentalFactors: mockEnvironmentalFactors,
        temporalPatterns: cyclicPatterns,
        consciousnessMetrics: mockMetrics
      });

      const temporalPatterns = result.patterns.filter(p => 
        p.type === 'temporal_cycle' || p.type === 'dimensional_harmony'
      );

      expect(temporalPatterns.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    test('should detect pattern complexity correctly', async () => {
      // Create increasingly complex patterns
      const complexPatterns = Array.from({ length: 10 }, (_, i) => ({
        timestamp: Date.now() - (9 - i) * 1000,
        quantumPhase: Math.sin(i * Math.PI / 2),
        coherence: 0.7 + 0.02 * Math.sin(i),
        stability: 0.8 + 0.01 * Math.cos(i),
        dimensionalAlignment: 0.6 + 0.03 * Math.sin(i * 2)
      }));

      const result = await recognizer.recognizePatterns({
        quantumState: mockQuantumState,
        environmentalFactors: mockEnvironmentalFactors,
        temporalPatterns: complexPatterns,
        consciousnessMetrics: mockMetrics
      });

      expect(result.complexity).toBeGreaterThan(0.5);
    });
  });

  describe('Pattern Correlation', () => {
    test('should identify correlated environmental and quantum patterns', async () => {
      // Create correlated patterns
      const correlatedEnvironmentalFactors = Array.from({ length: 5 }, (_, i) => ({
        type: 'QUANTUM_FIELD',
        intensity: 0.6 + (i * 0.05),
        influence: 0.5 + (i * 0.05),
        timestamp: Date.now() - (4 - i) * 1000
      }));

      const correlatedQuantumState = {
        ...mockQuantumState,
        coherence_level: 0.8,
        resonance_patterns: correlatedEnvironmentalFactors.map((_, i) => ({
          coherence: 0.6 + (i * 0.05),
          frequency: 0.5,
          amplitude: 0.5 + (i * 0.05),
          phase: i * Math.PI / 5,
          timestamp: Date.now() - (4 - i) * 1000
        }))
      };

      const result = await recognizer.recognizePatterns({
        quantumState: correlatedQuantumState,
        environmentalFactors: correlatedEnvironmentalFactors,
        temporalPatterns: mockTemporalPatterns,
        consciousnessMetrics: mockMetrics
      });

      const correlatedPatterns = result.patterns.filter(p =>
        p.type.includes('correlation') || p.type.includes('resonance')
      );

      expect(correlatedPatterns.length).toBeGreaterThan(0);
      correlatedPatterns.forEach(pattern => {
        expect(pattern.confidence).toBeGreaterThan(0.6);
      });
    });
  });

  describe('Emergence Detection', () => {
    test('should identify emergent patterns in complex data', async () => {
      // Create data with emergent properties
      const emergentEnvironmentalFactors = Array.from({ length: 20 }, (_, i) => ({
        type: i % 2 === 0 ? 'QUANTUM_FIELD' : 'RESONANCE',
        intensity: 0.5 + 0.2 * Math.sin(i * Math.PI / 5),
        influence: 0.5 + 0.2 * Math.cos(i * Math.PI / 5),
        timestamp: Date.now() - (19 - i) * 1000,
        frequency: i % 2 === 0 ? undefined : 0.5 + 0.1 * Math.sin(i * Math.PI / 5)
      }));

      const result = await recognizer.recognizePatterns({
        quantumState: mockQuantumState,
        environmentalFactors: emergentEnvironmentalFactors,
        temporalPatterns: mockTemporalPatterns,
        consciousnessMetrics: mockMetrics
      });

      const emergentPatterns = result.patterns.filter(p =>
        p.type.includes('emergence') || p.significance > 0.8
      );

      expect(emergentPatterns.length).toBeGreaterThan(0);
    });
  });

  describe('Pattern Stability', () => {
    test('should maintain pattern recognition stability under noise', async () => {
      const noisyPatterns = mockTemporalPatterns.map(pattern => ({
        ...pattern,
        coherence: pattern.coherence + (Math.random() - 0.5) * 0.1,
        stability: pattern.stability + (Math.random() - 0.5) * 0.1,
        dimensionalAlignment: pattern.dimensionalAlignment + (Math.random() - 0.5) * 0.1
      }));

      const result1 = await recognizer.recognizePatterns({
        quantumState: mockQuantumState,
        environmentalFactors: mockEnvironmentalFactors,
        temporalPatterns: mockTemporalPatterns,
        consciousnessMetrics: mockMetrics
      });

      const result2 = await recognizer.recognizePatterns({
        quantumState: mockQuantumState,
        environmentalFactors: mockEnvironmentalFactors,
        temporalPatterns: noisyPatterns,
        consciousnessMetrics: mockMetrics
      });

      // Pattern recognition should be relatively stable despite noise
      expect(Math.abs(result1.confidence - result2.confidence)).toBeLessThan(0.2);
    });
  });

  describe('Performance', () => {
    test('should handle large pattern sets efficiently', async () => {
      const largePatternSet = Array.from({ length: 100 }, (_, i) => ({
        timestamp: Date.now() - (99 - i) * 1000,
        quantumPhase: Math.random() * Math.PI * 2,
        coherence: 0.5 + Math.random() * 0.5,
        stability: 0.5 + Math.random() * 0.5,
        dimensionalAlignment: 0.5 + Math.random() * 0.5
      }));

      const startTime = Date.now();
      
      const result = await recognizer.recognizePatterns({
        quantumState: mockQuantumState,
        environmentalFactors: mockEnvironmentalFactors,
        temporalPatterns: largePatternSet,
        consciousnessMetrics: mockMetrics
      });

      const duration = Date.now() - startTime;

      // Should process 100 patterns in under 100ms
      expect(duration).toBeLessThan(100);
      expect(result.patterns.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid pattern data gracefully', async () => {
      const invalidTemporalPatterns = [
        {
          timestamp: Date.now(),
          quantumPhase: NaN,
          coherence: -1,
          stability: 2,
          dimensionalAlignment: undefined
        }
      ];

      const result = await recognizer.recognizePatterns({
        quantumState: mockQuantumState,
        environmentalFactors: mockEnvironmentalFactors,
        temporalPatterns: invalidTemporalPatterns as any,
        consciousnessMetrics: mockMetrics
      });

      // Should still return valid results
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.patterns).toBeDefined();
    });
  });

  describe('Pattern History', () => {
    test('should maintain and utilize pattern history effectively', async () => {
      // Process patterns multiple times
      const results = [];
      for (let i = 0; i < 5; i++) {
        const result = await recognizer.recognizePatterns({
          quantumState: mockQuantumState,
          environmentalFactors: mockEnvironmentalFactors,
          temporalPatterns: mockTemporalPatterns,
          consciousnessMetrics: mockMetrics
        });
        results.push(result);
      }

      // Pattern recognition should improve with history
      const confidences = results.map(r => r.confidence);
      expect(confidences[confidences.length - 1]).toBeGreaterThanOrEqual(confidences[0]);
    });
  });

  describe('Metrics', () => {
    test('should provide accurate pattern recognition metrics', () => {
      const metrics = recognizer.getMetrics();
      
      expect(metrics).toHaveProperty('recognizedPatternsCount');
      expect(metrics).toHaveProperty('patternTypeDistribution');
      expect(metrics.recognizedPatternsCount).toBeGreaterThanOrEqual(0);
      
      // Distribution should sum to total count
      const totalDistribution = Object.values(metrics.patternTypeDistribution)
        .reduce((sum, count) => sum + count, 0);
      expect(totalDistribution).toBe(metrics.recognizedPatternsCount);
    });
  });
});
