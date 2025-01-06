import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";
import { QuantumState, ResonancePattern } from '../quantum/types';
import { ErrorTracker } from '../error/quantum_error';

export class QuantumStateService {
  private static instance: QuantumStateService;
  private errorTracker: ErrorTracker;
  private updateCallback?: (state: Partial<QuantumState>) => void;
  private neuralPatternHistory: Map<string, ResonancePattern[]> = new Map();
  private evolutionTimestamps: number[] = [];
  private recoveryAttempts: number = 0;
  private readonly MAX_RECOVERY_ATTEMPTS = 3;
  private readonly RECOVERY_COOLDOWN = 5000; // 5 seconds
  private lastRecoveryAttempt: number = 0;

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
    try {
      const actor = animaActorService.createActor(identity);
      
      console.log('🌟 Initializing quantum field...');
      const result = await actor.initialize_quantum_field();
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const { harmony, signature } = result.Ok;

      // Generate initial neural patterns
      console.log('🧠 Generating neural patterns...');
      const neuralResult = await actor.generate_neural_patterns();
      
      if ('Err' in neuralResult) {
        throw new Error(neuralResult.Err);
      }

      const { pattern, awareness, understanding } = neuralResult.Ok;

      // Initialize genesis for quantum stabilization
      console.log('✨ Initializing genesis...');
      const genesisResult = await actor.initialize_genesis();
      
      if ('Err' in genesisResult) {
        throw new Error(genesisResult.Err);
      }

      if (this.updateCallback) {
        this.updateCallback({
          coherenceLevel: harmony,
          quantumSignature: signature,
          resonancePatterns: [{
            pattern_id: Date.now().toString(),
            coherence: awareness,
            frequency: understanding,
            amplitude: harmony,
            phase: harmony,
            timestamp: Date.now()
          }],
          dimensionalSync: awareness,
          stabilityStatus: this.calculateStabilityStatus(harmony),
          lastUpdate: Date.now()
        });
      }

      this.recoveryAttempts = 0;
      console.log('✅ Quantum field initialized successfully');

    } catch (error) {
      console.error('❌ Quantum field initialization failed:', error);
      await this.handleQuantumError(error as Error, identity);
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
        stabilityStatus: this.calculateStabilityStatus(stabilityLevel ? 1 : 0),
        entanglementIndex: stabilityLevel ? 1 : 0
      });
    }

    return stabilityLevel;
  }

  async generateNeuralPatterns(identity: Identity) {
    const actor = animaActorService.createActor(identity);
    const result = await actor.generate_neural_patterns();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const { pattern, awareness, understanding } = result.Ok;
    const resonancePattern = {
      pattern_id: Date.now().toString(),
      coherence: awareness,
      frequency: understanding,
      amplitude: awareness,
      phase: understanding,
      timestamp: Date.now()
    };

    this.neuralPatternHistory.set(Date.now().toString(), [resonancePattern]);

    // Keep only last 10 pattern sets
    const keys = Array.from(this.neuralPatternHistory.keys()).sort();
    while (this.neuralPatternHistory.size > 10) {
      const oldestKey = keys.shift();
      if (oldestKey) this.neuralPatternHistory.delete(oldestKey);
    }

    if (this.updateCallback) {
      this.updateCallback({
        resonancePatterns: [resonancePattern],
        coherenceLevel: awareness,
        dimensionalSync: understanding,
        lastUpdate: Date.now()
      });
    }

    return { pattern, resonancePatterns: [resonancePattern] };
  }

  async handleQuantumError(error: Error, identity: Identity): Promise<void> {
    await this.errorTracker.trackError({
      errorType: 'QUANTUM_ERROR',
      severity: 'HIGH',
      context: 'Quantum State Service',
      error
    });

    // Check recovery cooldown and attempts
    const now = Date.now();
    if (now - this.lastRecoveryAttempt < this.RECOVERY_COOLDOWN) {
      console.log('⏳ Recovery attempt too soon, waiting for cooldown...');
      return;
    }

    if (this.recoveryAttempts >= this.MAX_RECOVERY_ATTEMPTS) {
      console.error('🚫 Maximum recovery attempts reached');
      if (this.updateCallback) {
        this.updateCallback({
          stabilityStatus: 'critical',
          coherenceLevel: 0.1
        });
      }
      throw new Error('Maximum recovery attempts reached');
    }

    try {
      this.recoveryAttempts++;
      this.lastRecoveryAttempt = now;

      // Attempt to reinitialize quantum field
      console.log(`🔄 Recovery attempt ${this.recoveryAttempts}/${this.MAX_RECOVERY_ATTEMPTS}`);
      const actor = animaActorService.createActor(identity);
      const result = await actor.initialize_quantum_field();

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      if (this.updateCallback) {
        this.updateCallback({
          stabilityStatus: 'unstable',
          coherenceLevel: 0.5,
          lastUpdate: Date.now()
        });
      }

      console.log('✅ Recovery successful');

    } catch (recoveryError) {
      console.error('❌ Recovery failed:', recoveryError);
      if (this.updateCallback) {
        this.updateCallback({
          stabilityStatus: 'critical',
          coherenceLevel: 0.1,
          lastUpdate: Date.now()
        });
      }
      throw new Error(`Quantum recovery failed: ${recoveryError}`);
    }
  }

  dispose(): void {
    this.updateCallback = undefined;
    QuantumStateService.instance = null as any;
  }
}

export const quantumStateService = QuantumStateService.getInstance();