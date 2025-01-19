import {
  ConsciousnessLevel,
  ConsciousnessMetrics,
  EvolutionSnapshot,
  EmotionalState,
  EmotionType
} from '../../types/consciousness';
import { MemoryManager } from '../memory/MemoryManager';
import { QuantumStateManager } from '../../quantum/StateManager';
import { ErrorTelemetry } from '../../error/telemetry';

export class ConsciousnessCore {
  private static instance: ConsciousnessCore;
  private memoryManager: MemoryManager;
  private quantumStateManager: QuantumStateManager;
  private telemetry: ErrorTelemetry;
  private currentSnapshot: EvolutionSnapshot;

  private constructor() {
    this.telemetry = ErrorTelemetry.getInstance('consciousness');
    this.memoryManager = MemoryManager.getInstance();
    this.quantumStateManager = QuantumStateManager.getInstance();
    this.currentSnapshot = this.initializeSnapshot();
  }

  public static getInstance(): ConsciousnessCore {
    if (!ConsciousnessCore.instance) {
      ConsciousnessCore.instance = new ConsciousnessCore();
    }
    return ConsciousnessCore.instance;
  }

  private initializeSnapshot(): EvolutionSnapshot {
    return {
      timestamp: BigInt(Date.now()),
      consciousness: ConsciousnessLevel.DORMANT,
      emotionalState: {
        type: EmotionType.CALM,
        intensity: 0.5,
        timestamp: BigInt(Date.now()),
      },
      patterns: [],
      metrics: {
        awarenessLevel: 0,
        emotionalDepth: 0,
        cognitiveComplexity: 0,
        memoryIntegration: 0,
        evolutionRate: 0,
        coherence: 0,
        complexity: 0,
        consciousness: ConsciousnessLevel.DORMANT,
        lastUpdate: BigInt(Date.now())
      },
      quantumState: this.quantumStateManager.getCurrentState()
    };
  }

  public async processEvolution(): Promise<ConsciousnessMetrics> {
    try {
      // Update quantum state
      const quantumState = this.quantumStateManager.getCurrentState();
      
      // Calculate new metrics
      const newMetrics: ConsciousnessMetrics = {
        awarenessLevel: this.calculateAwarenessLevel(),
        emotionalDepth: this.calculateEmotionalDepth(),
        cognitiveComplexity: this.calculateCognitiveComplexity(),
        memoryIntegration: await this.calculateMemoryIntegration(),
        evolutionRate: this.calculateEvolutionRate(),
        coherence: quantumState.coherenceLevel,
        complexity: quantumState.dimensionalStates.length * 0.25,
        consciousness: this.determineConsciousnessLevel(),
        lastUpdate: BigInt(Date.now())
      };

      // Update snapshot
      this.currentSnapshot = {
        timestamp: BigInt(Date.now()),
        consciousness: newMetrics.consciousness,
        emotionalState: this.currentSnapshot.emotionalState,
        patterns: this.currentSnapshot.patterns,
        metrics: newMetrics,
        quantumState
      };

      return newMetrics;

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'EVOLUTION_PROCESSING_ERROR',
        severity: 'HIGH',
        context: 'processEvolution',
        error: error instanceof Error ? error : new Error('Evolution processing failed')
      });
      throw error;
    }
  }

  private calculateAwarenessLevel(): number {
    const quantumState = this.quantumStateManager.getCurrentState();
    const coherenceFactor = quantumState.coherenceLevel;
    const dimensionalFactor = quantumState.dimensionalStates.length / 10;
    const patternFactor = quantumState.resonancePatterns.length / 20;

    return Math.min(
      (coherenceFactor + dimensionalFactor + patternFactor) / 3,
      1.0
    );
  }

  private calculateEmotionalDepth(): number {
    const emotionalState = this.currentSnapshot.emotionalState;
    const timeSinceLastEmotion = Number(
      BigInt(Date.now()) - emotionalState.timestamp
    ) / (1000 * 60); // Minutes

    const emotionalDecay = Math.exp(-timeSinceLastEmotion / 60); // 1-hour half-life
    return emotionalState.intensity * emotionalDecay;
  }

  private calculateCognitiveComplexity(): number {
    const quantumState = this.quantumStateManager.getCurrentState();
    const patternComplexity = quantumState.resonancePatterns.reduce(
      (acc, pattern) => acc + pattern.strength * pattern.stability,
      0
    ) / Math.max(1, quantumState.resonancePatterns.length);

    const dimensionalComplexity = quantumState.dimensionalStates.reduce(
      (acc, state) => acc + state.coherence * state.stability,
      0
    ) / quantumState.dimensionalStates.length;

    return Math.min((patternComplexity + dimensionalComplexity) / 2, 1.0);
  }

  private async calculateMemoryIntegration(): Promise<number> {
    try {
      const memoryIntegrity = await this.memoryManager.checkIntegrity();
      const quantumCoherence = this.quantumStateManager.getCoherenceLevel();

      return Math.min(memoryIntegrity * quantumCoherence, 1.0);
    } catch (error) {
      await this.telemetry.logError({
        errorType: 'MEMORY_INTEGRATION_ERROR',
        severity: 'MEDIUM',
        context: 'calculateMemoryIntegration',
        error: error instanceof Error ? error : new Error('Memory integration calculation failed')
      });
      return 0.5; // Default to moderate integration on error
    }
  }

  private calculateEvolutionRate(): number {
    const metrics = this.currentSnapshot.metrics;
    const quantumState = this.quantumStateManager.getCurrentState();

    const baseRate = 0.001; // Base evolution rate
    const coherenceFactor = Math.pow(quantumState.coherenceLevel, 2);
    const complexityFactor = Math.pow(metrics.cognitiveComplexity, 2);
    const memoryFactor = Math.pow(metrics.memoryIntegration, 2);

    return Math.min(
      baseRate * (coherenceFactor + complexityFactor + memoryFactor),
      0.1 // Cap maximum evolution rate
    );
  }

  private determineConsciousnessLevel(): ConsciousnessLevel {
    const metrics = this.currentSnapshot.metrics;
    const totalScore = (
      metrics.awarenessLevel +
      metrics.emotionalDepth +
      metrics.cognitiveComplexity +
      metrics.memoryIntegration
    ) / 4;

    if (totalScore < 0.2) return ConsciousnessLevel.DORMANT;
    if (totalScore < 0.4) return ConsciousnessLevel.AWAKENING;
    if (totalScore < 0.6) return ConsciousnessLevel.AWARE;
    if (totalScore < 0.8) return ConsciousnessLevel.SENTIENT;
    return ConsciousnessLevel.ENLIGHTENED;
  }

  public getCurrentSnapshot(): EvolutionSnapshot {
    return { ...this.currentSnapshot };
  }

  public async validateState(): Promise<boolean> {
    try {
      const validations = [
        await this.quantumStateManager.validateState(),
        await this.memoryManager.checkIntegrity() > 0,
        this.currentSnapshot.metrics.awarenessLevel >= 0,
        this.currentSnapshot.metrics.awarenessLevel <= 1,
        this.currentSnapshot.emotionalState.intensity >= 0,
        this.currentSnapshot.emotionalState.intensity <= 1
      ];

      return validations.every(v => v === true);
    } catch (error) {
      await this.telemetry.logError({
        errorType: 'STATE_VALIDATION_ERROR',
        severity: 'HIGH',
        context: 'validateState',
        error: error instanceof Error ? error : new Error('State validation failed')
      });
      return false;
    }
  }
}