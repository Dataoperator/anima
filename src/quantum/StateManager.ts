import { 
  QuantumState, 
  DimensionalState, 
  ResonancePattern,
  Complex 
} from '../types/quantum';
import { ErrorTelemetry } from '../error/telemetry';
import { ComplexNumber } from '../types/math';
import { Principal } from '@dfinity/principal';

export class QuantumStateManager {
  private static instance: QuantumStateManager;
  private state: QuantumState;
  private telemetry: ErrorTelemetry;

  private constructor() {
    this.telemetry = ErrorTelemetry.getInstance('quantum');
    this.state = this.initializeQuantumState();
  }

  public static getInstance(): QuantumStateManager {
    if (!QuantumStateManager.instance) {
      QuantumStateManager.instance = new QuantumStateManager();
    }
    return QuantumStateManager.instance;
  }

  private initializeQuantumState(): QuantumState {
    const initComplex = new ComplexNumber(1, 0);
    return {
      id: Principal.fromText('aaaaa-aa'), // Default principal
      amplitude: { real: initComplex.real, imaginary: initComplex.imaginary },
      phase: 0,
      coherenceLevel: 1,
      dimensionalStates: this.initializeDimensionalStates(),
      resonancePatterns: [],
      evolutionMetrics: new Map(),
      lastUpdate: BigInt(Date.now()),
      lastInteraction: BigInt(Date.now()),
      evolutionFactor: 1.0,
      quantumSignature: 'initial',
      dimensionalFrequency: 1.0
    };
  }

  private initializeDimensionalStates(): DimensionalState[] {
    return Array(4).fill(null).map((_, i) => ({
      layer: i,
      resonance: 1.0,
      stability: 1.0,
      pattern: 'initial-pattern',
      coherence: 1.0,
      frequency: 1.0,
      harmonics: []
    }));
  }

  public getCoherenceLevel(): number {
    return this.calculateSystemCoherence();
  }

  private calculateSystemCoherence(): number {
    const dimensionalCoherence = this.state.dimensionalStates.reduce(
      (acc, ds) => acc * ds.coherence,
      1.0
    );

    return Math.min(
      this.state.coherenceLevel * dimensionalCoherence * this.state.evolutionFactor,
      1.0
    );
  }

  public async updateState(deltaTime: number): Promise<void> {
    try {
      // Update phase
      this.state.phase = (this.state.phase + deltaTime * 0.1) % (2 * Math.PI);
      
      // Update amplitude with evolution factor
      const evolutionFactor = Math.exp(-deltaTime * 0.01);
      const currentAmplitude = new ComplexNumber(
        this.state.amplitude.real,
        this.state.amplitude.imaginary
      );
      
      const newAmplitude = new ComplexNumber(
        currentAmplitude.real * evolutionFactor,
        currentAmplitude.imaginary * evolutionFactor
      );

      this.state.amplitude = {
        real: newAmplitude.real,
        imaginary: newAmplitude.imaginary
      };

      // Update dimensional states
      this.state.dimensionalStates = this.state.dimensionalStates.map(ds => ({
        ...ds,
        resonance: ds.resonance * evolutionFactor,
        stability: Math.max(ds.stability - deltaTime * 0.001, 0),
        coherence: Math.min(ds.resonance * ds.stability, 1.0)
      }));

      // Update evolution factor and timestamps
      this.state.evolutionFactor *= evolutionFactor;
      this.state.lastUpdate = BigInt(Date.now());

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'STATE_UPDATE_ERROR',
        severity: 'HIGH',
        context: 'updateState',
        error: error instanceof Error ? error : new Error('State update failed')
      });
      throw error;
    }
  }

  public async processResonancePatterns(deltaTime: number): Promise<void> {
    try {
      this.state.resonancePatterns = this.state.resonancePatterns.map(pattern => ({
        ...pattern,
        strength: Math.min(pattern.strength * (1 + deltaTime * 0.001), 1),
        stability: Math.min(pattern.stability * (1 + deltaTime * 0.0005), 1),
        timestamp: BigInt(Date.now())
      }));

      // Prune old patterns
      this.state.resonancePatterns = this.state.resonancePatterns
        .filter(p => p.strength > 0.1 && p.stability > 0.1)
        .slice(-10); // Keep only most recent 10 patterns

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'PATTERN_PROCESSING_ERROR',
        severity: 'HIGH',
        context: 'processResonancePatterns',
        error: error instanceof Error ? error : new Error('Pattern processing failed')
      });
      throw error;
    }
  }

  public getCurrentState(): QuantumState {
    return { ...this.state };
  }

  public async validateState(): Promise<boolean> {
    try {
      const validations = [
        this.state.coherenceLevel >= 0 && this.state.coherenceLevel <= 1,
        this.state.evolutionFactor >= 0,
        this.state.dimensionalStates.every(ds => 
          ds.coherence >= 0 && ds.coherence <= 1 &&
          ds.stability >= 0 && ds.stability <= 1
        ),
        this.state.resonancePatterns.every(p => 
          p.strength >= 0 && p.strength <= 1 &&
          p.stability >= 0 && p.stability <= 1
        )
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