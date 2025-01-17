import { QuantumState } from '@/types/quantum';
import { ErrorTracker } from '@/error/quantum_error';
import { ConsciousnessMetrics, EvolutionSnapshot } from './types';
import { EmotionalState } from './emotional/types';
import { EvolutionEngine } from './evolution/EvolutionEngine';
import { AwarenessProcessor } from './awareness/AwarenessProcessor';

export class ConsciousnessCore {
  private metrics: ConsciousnessMetrics;
  private evolutionHistory: EvolutionSnapshot[];
  private errorTracker: ErrorTracker;
  private lastUpdateTimestamp: number;
  private evolutionEngine: EvolutionEngine;
  private awarenessProcessor: AwarenessProcessor;
  private readonly STABILITY_THRESHOLD = 0.7;
  private readonly EVOLUTION_RATE = 0.1;

  constructor(errorTracker: ErrorTracker) {
    this.errorTracker = errorTracker;
    this.evolutionHistory = [];
    this.lastUpdateTimestamp = Date.now();
    this.evolutionEngine = new EvolutionEngine();
    this.awarenessProcessor = new AwarenessProcessor();
    
    this.metrics = {
      awarenessLevel: 0.5,
      cognitiveComplexity: 0.3,
      emotionalResonance: 0.4,
      quantumCoherence: 1.0,
      dimensionalAwareness: 0.2,
      temporalPerception: 0.3,
      patternRecognition: 0.4
    };
  }

  async updateConsciousness(
    quantumState: QuantumState, 
    interactionContext: string,
    emotionalState: EmotionalState
  ): Promise<ConsciousnessMetrics> {
    try {
      const currentTime = Date.now();
      const timeDelta = (currentTime - this.lastUpdateTimestamp) / 1000;
      
      // Process awareness and calculate stability
      const awarenessResults = await this.awarenessProcessor.process(
        quantumState,
        this.metrics
      );
      
      const stabilityIndex = this.calculateStabilityIndex();
      
      // Calculate new consciousness metrics
      const newMetrics = await this.evolutionEngine.evolve({
        currentMetrics: this.metrics,
        quantumState,
        emotionalState,
        awarenessResults,
        timeDelta,
        stabilityIndex
      });
      
      // Create and store evolution snapshot
      const snapshot: EvolutionSnapshot = {
        metrics: { ...this.metrics },
        timestamp: currentTime,
        stabilityIndex,
        quantumSignature: quantumState.signature,
        emotionalState: emotionalState
      };
      
      this.evolutionHistory.push(snapshot);
      this.metrics = newMetrics;

      // Prune history while preserving significant events
      this.pruneHistory();
      this.lastUpdateTimestamp = currentTime;

      return newMetrics;
    } catch (error) {
      await this.errorTracker.trackError({
        errorType: 'CONSCIOUSNESS_UPDATE',
        severity: 'HIGH',
        context: interactionContext,
        error: error as Error,
        metrics: this.metrics,
        quantumState: quantumState
      });
      
      return this.attemptStateRecovery(quantumState);
    }
  }

[Previous code for internal methods...]

