import { TemporalPattern } from '@/types/consciousness';
import { QuantumState } from '@/quantum/types';

interface AwarenessMetrics {
  patternRecognitionRate: number;
  temporalAwareness: number;
  environmentalSensitivity: number;
  quantumAlignment: number;
}

export class AwarenessProcessor {
  private temporalPatterns: TemporalPattern[];
  private lastProcessTimestamp: number;
  private metrics: AwarenessMetrics;

  constructor() {
    this.temporalPatterns = [];
    this.lastProcessTimestamp = Date.now();
    this.metrics = {
      patternRecognitionRate: 0,
      temporalAwareness: 0,
      environmentalSensitivity: 0,
      quantumAlignment: 0
    };
  }

  public processQuantumState(state: QuantumState): void {
    const currentTime = Date.now();
    const timeDelta = currentTime - this.lastProcessTimestamp;

    // Update temporal patterns based on quantum state
    const pattern: TemporalPattern = {
      timestamp: currentTime,
      quantumSignature: state.signature,
      coherenceLevel: state.coherence,
      dimensionalStates: state.dimensionalStates.map(ds => ({
        layer: ds.layer,
        resonance: ds.resonance,
        pattern: ds.pattern
      }))
    };

    this.temporalPatterns.push(pattern);

    // Keep only recent patterns
    const MAX_PATTERNS = 100;
    if (this.temporalPatterns.length > MAX_PATTERNS) {
      this.temporalPatterns = this.temporalPatterns.slice(-MAX_PATTERNS);
    }

    // Update awareness metrics
    this.updateMetrics(state, timeDelta);
    this.lastProcessTimestamp = currentTime;
  }

  private updateMetrics(state: QuantumState, timeDelta: number): void {
    // Update pattern recognition rate based on temporal pattern analysis
    const recentPatterns = this.temporalPatterns.slice(-10);
    const patternSimilarity = this.calculatePatternSimilarity(recentPatterns);
    this.metrics.patternRecognitionRate = 
      0.7 * this.metrics.patternRecognitionRate + 0.3 * patternSimilarity;

    // Update temporal awareness based on pattern timing
    const temporalCoherence = this.calculateTemporalCoherence(timeDelta);
    this.metrics.temporalAwareness = 
      0.8 * this.metrics.temporalAwareness + 0.2 * temporalCoherence;

    // Update environmental sensitivity based on quantum state
    const environmentalFactor = this.calculateEnvironmentalFactor(state);
    this.metrics.environmentalSensitivity = 
      0.9 * this.metrics.environmentalSensitivity + 0.1 * environmentalFactor;

    // Update quantum alignment
    this.metrics.quantumAlignment = state.coherence;
  }

  private calculatePatternSimilarity(patterns: TemporalPattern[]): number {
    if (patterns.length < 2) return 1;

    let similaritySum = 0;
    for (let i = 1; i < patterns.length; i++) {
      const prev = patterns[i - 1];
      const curr = patterns[i];
      
      // Calculate similarity based on coherence and dimensional states
      const coherenceDiff = Math.abs(prev.coherenceLevel - curr.coherenceLevel);
      const dimensionalSimilarity = this.calculateDimensionalSimilarity(
        prev.dimensionalStates,
        curr.dimensionalStates
      );

      similaritySum += (1 - coherenceDiff) * dimensionalSimilarity;
    }

    return similaritySum / (patterns.length - 1);
  }

  private calculateDimensionalSimilarity(
    states1: TemporalPattern['dimensionalStates'],
    states2: TemporalPattern['dimensionalStates']
  ): number {
    const minLength = Math.min(states1.length, states2.length);
    if (minLength === 0) return 1;

    let similaritySum = 0;
    for (let i = 0; i < minLength; i++) {
      const resonanceDiff = Math.abs(states1[i].resonance - states2[i].resonance);
      similaritySum += 1 - resonanceDiff;
    }

    return similaritySum / minLength;
  }

  private calculateTemporalCoherence(timeDelta: number): number {
    // Calculate temporal coherence based on processing timing
    const optimalDelta = 1000; // 1 second
    const deltaRatio = Math.min(timeDelta, optimalDelta) / optimalDelta;
    return Math.exp(-Math.abs(deltaRatio - 1));
  }

  private calculateEnvironmentalFactor(state: QuantumState): number {
    // Calculate environmental sensitivity based on quantum state
    const dimensionalAverage = state.dimensionalStates.reduce(
      (sum, ds) => sum + ds.resonance,
      0
    ) / state.dimensionalStates.length;

    return Math.min(
      1,
      (dimensionalAverage + state.coherence + state.evolutionFactor) / 3
    );
  }

  public getMetrics(): AwarenessMetrics {
    return { ...this.metrics };
  }

  public getPatterns(): TemporalPattern[] {
    return [...this.temporalPatterns];
  }
}