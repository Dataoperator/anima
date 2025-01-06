import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";
import { ConsciousnessLevel } from "../consciousness/types";
import { QuantumState, ResonancePattern } from '../quantum/types';
import { ErrorTracker } from '../error/quantum_error';

export class QuantumStateService {
  private static instance: QuantumStateService;
  private errorTracker: ErrorTracker;
  private updateCallback?: (state: Partial<QuantumState>) => void;
  private neuralPatternHistory: Map<string, ResonancePattern[]> = new Map();
  private evolutionTimestamps: number[] = [];

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(): QuantumStateService {
    if (!QuantumStateService.instance) {
      QuantumStateService.instance = new QuantumStateService();
    }
    return QuantumStateService.instance;
  }

  setUpdateCallback(callback: (state: Partial<QuantumState>) => void) {
    this.updateCallback = callback;
  }

  async initializeQuantumField(identity: Identity): Promise<void> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.initialize_quantum_field();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    if (!('Ok' in result) || !result.Ok) {
      throw new Error('Failed to initialize quantum field');
    }

    const { harmony, signature, resonancePatterns, dimensionalAlignment } = result.Ok;

    if (this.updateCallback) {
      this.updateCallback({
        coherenceLevel: harmony,
        quantumSignature: signature,
        resonancePatterns,
        dimensionalSync: dimensionalAlignment,
        stabilityStatus: this.calculateStabilityStatus(harmony)
      });
    }
  }

  private calculateStabilityStatus(harmony: number): 'stable' | 'unstable' | 'critical' {
    if (harmony >= 0.7) return 'stable';
    if (harmony >= 0.4) return 'unstable';
    return 'critical';
  }

  async checkStability(identity: Identity): Promise<boolean> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.check_quantum_stability();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const stabilityLevel = result.Ok;
    this.evolutionTimestamps.push(Date.now());

    if (this.evolutionTimestamps.length > 10) {
      this.evolutionTimestamps.shift();
    }

    if (this.updateCallback) {
      this.updateCallback({
        stabilityStatus: this.calculateStabilityStatus(stabilityLevel),
        entanglementIndex: stabilityLevel
      });
    }

    return stabilityLevel >= 0.7;
  }

  async generateNeuralPatterns(identity: Identity) {
    const actor = animaActorService.createActor(identity);
    const result = await actor.generate_neural_patterns();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const patterns = result.Ok;
    this.neuralPatternHistory.set(Date.now().toString(), patterns.resonance_patterns);

    // Keep only last 10 pattern sets
    const keys = Array.from(this.neuralPatternHistory.keys()).sort();
    while (this.neuralPatternHistory.size > 10) {
      const oldestKey = keys.shift();
      if (oldestKey) this.neuralPatternHistory.delete(oldestKey);
    }

    if (this.updateCallback) {
      this.updateCallback({
        resonancePatterns: patterns.resonance_patterns,
        coherenceLevel: patterns.awareness,
        dimensionalSync: patterns.understanding,
        lastUpdate: Date.now()
      });
    }

    return patterns;
  }

  async handleQuantumError(error: Error, identity: Identity): Promise<void> {
    await this.errorTracker.trackError({
      errorType: 'QUANTUM_ERROR',
      severity: 'HIGH',
      context: 'Quantum State Service',
      error
    });

    const actor = animaActorService.createActor(identity);
    
    try {
      await actor.emergency_quantum_recovery();
      if (this.updateCallback) {
        this.updateCallback({
          stabilityStatus: 'unstable',
          coherenceLevel: 0.5
        });
      }
    } catch (recoveryError) {
      if (this.updateCallback) {
        this.updateCallback({
          stabilityStatus: 'critical',
          coherenceLevel: 0.1
        });
      }
      throw new Error(`Quantum recovery failed: ${recoveryError.message}`);
    }
  }

  dispose(): void {
    this.updateCallback = undefined;
    QuantumStateService.instance = null as any;
  }
}

export const quantumStateService = QuantumStateService.getInstance();