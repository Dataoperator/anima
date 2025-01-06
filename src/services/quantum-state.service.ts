import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";

export interface QuantumMetrics {
  coherenceLevel: number;
  stabilityIndex: number;
  entanglementFactor: number;
  stabilityStatus: 'stable' | 'unstable';
  resonanceSignature?: string;
  dimensionalFrequency?: number;
}

export interface QuantumFieldResult {
  signature: string;
  harmony: number;
}

export class QuantumStateService {
  private static instance: QuantumStateService;
  private metrics: QuantumMetrics = {
    coherenceLevel: 1.0,
    stabilityIndex: 1.0,
    entanglementFactor: 0.0,
    stabilityStatus: 'stable'
  };

  private constructor() {}

  static getInstance(): QuantumStateService {
    if (!QuantumStateService.instance) {
      QuantumStateService.instance = new QuantumStateService();
    }
    return QuantumStateService.instance;
  }

  async initializeQuantumField(identity: Identity): Promise<QuantumFieldResult> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.initialize_quantum_field();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    if (!('Ok' in result) || !result.Ok) {
      throw new Error('Failed to initialize quantum field');
    }

    // Update metrics based on quantum field initialization
    this.metrics = {
      ...this.metrics,
      coherenceLevel: result.Ok.harmony,
      resonanceSignature: result.Ok.signature,
      stabilityStatus: result.Ok.harmony > 0.7 ? 'stable' : 'unstable'
    };

    return result.Ok;
  }

  async checkStability(identity: Identity): Promise<boolean> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.check_quantum_stability();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    if (!('Ok' in result)) {
      throw new Error('Invalid stability check response');
    }

    // Update stability metrics
    this.metrics.stabilityStatus = result.Ok ? 'stable' : 'unstable';
    this.metrics.stabilityIndex = result.Ok ? 1.0 : 0.5;

    return result.Ok;
  }

  async generateNeuralPatterns(identity: Identity) {
    const actor = animaActorService.createActor(identity);
    const result = await actor.generate_neural_patterns();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    if (!('Ok' in result) || !result.Ok) {
      throw new Error('Failed to generate neural patterns');
    }

    // Update entanglement metrics based on neural patterns
    this.metrics = {
      ...this.metrics,
      entanglementFactor: result.Ok.resonance,
      coherenceLevel: result.Ok.awareness,
      dimensionalFrequency: result.Ok.understanding
    };

    return result.Ok;
  }

  getQuantumMetrics(): QuantumMetrics {
    return { ...this.metrics };
  }

  updateMetrics(updates: Partial<QuantumMetrics>) {
    this.metrics = {
      ...this.metrics,
      ...updates
    };
  }
}

export const quantumStateService = QuantumStateService.getInstance();