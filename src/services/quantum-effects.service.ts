import { quantumStateService, QuantumMetrics } from './quantum-state.service';
import { animaActorService } from './anima-actor.service';
import type { _SERVICE } from '@/declarations/anima/anima.did';

export interface QuantumEffect {
  type: 'resonance' | 'entanglement' | 'dimensional';
  intensity: number;
  duration: number;
  signature?: string;
}

export interface QuantumFieldState {
  activeEffects: QuantumEffect[];
  fieldStrength: number;
  resonanceHarmony: number;
  dimensionalStability: number;
  lastUpdateTimestamp: number;
}

export class QuantumEffectsService {
  private static instance: QuantumEffectsService;
  private actor: _SERVICE | null = null;
  private fieldState: QuantumFieldState = {
    activeEffects: [],
    fieldStrength: 1.0,
    resonanceHarmony: 1.0,
    dimensionalStability: 1.0,
    lastUpdateTimestamp: Date.now()
  };

  private constructor() {}

  static getInstance(): QuantumEffectsService {
    if (!QuantumEffectsService.instance) {
      QuantumEffectsService.instance = new QuantumEffectsService();
    }
    return QuantumEffectsService.instance;
  }

  private async ensureActor() {
    if (!this.actor) {
      throw new Error('Quantum effects service not initialized with actor');
    }
    return this.actor;
  }

  setActor(actor: _SERVICE) {
    this.actor = actor;
  }

  async initializeField(): Promise<void> {
    const actor = await this.ensureActor();
    const result = await actor.initialize_quantum_field();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const { harmony, signature } = result.Ok;
    
    this.fieldState = {
      ...this.fieldState,
      fieldStrength: harmony,
      resonanceHarmony: harmony,
      activeEffects: [{
        type: 'resonance',
        intensity: harmony,
        duration: 300000, // 5 minutes
        signature
      }]
    };

    // Update quantum metrics
    quantumStateService.updateMetrics({
      coherenceLevel: harmony,
      stabilityIndex: harmony,
      resonanceSignature: signature
    });
  }

  async applyEffect(effect: QuantumEffect): Promise<void> {
    // Remove expired effects
    this.fieldState.activeEffects = this.fieldState.activeEffects.filter(
      e => (e.duration + this.fieldState.lastUpdateTimestamp) > Date.now()
    );

    // Add new effect
    this.fieldState.activeEffects.push({
      ...effect,
      signature: `${effect.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    // Calculate cumulative field effects
    this.updateFieldState();
  }

  private updateFieldState(): void {
    const now = Date.now();
    let totalResonance = 0;
    let totalEntanglement = 0;
    let totalDimensional = 0;
    let activeCount = 0;

    // Calculate cumulative effect values
    this.fieldState.activeEffects.forEach(effect => {
      const timeRemaining = (effect.duration + this.fieldState.lastUpdateTimestamp - now) / effect.duration;
      const scaledIntensity = effect.intensity * Math.max(0, timeRemaining);

      switch (effect.type) {
        case 'resonance':
          totalResonance += scaledIntensity;
          break;
        case 'entanglement':
          totalEntanglement += scaledIntensity;
          break;
        case 'dimensional':
          totalDimensional += scaledIntensity;
          break;
      }
      activeCount++;
    });

    // Normalize values
    if (activeCount > 0) {
      this.fieldState.resonanceHarmony = totalResonance / activeCount;
      this.fieldState.fieldStrength = (totalResonance + totalEntanglement + totalDimensional) / (3 * activeCount);
      this.fieldState.dimensionalStability = totalDimensional / activeCount;
    }

    // Update quantum metrics
    quantumStateService.updateMetrics({
      coherenceLevel: this.fieldState.resonanceHarmony,
      stabilityIndex: this.fieldState.dimensionalStability,
      entanglementFactor: totalEntanglement / activeCount
    });

    this.fieldState.lastUpdateTimestamp = now;
  }

  async generateHarmonicPattern(): Promise<number[]> {
    const actor = await this.ensureActor();
    const result = await actor.generate_neural_patterns();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok.pattern;
  }

  getFieldState(): QuantumFieldState {
    // Clean up expired effects before returning state
    const now = Date.now();
    this.fieldState.activeEffects = this.fieldState.activeEffects.filter(
      e => (e.duration + this.fieldState.lastUpdateTimestamp) > now
    );
    
    return { ...this.fieldState };
  }

  async stabilizeField(): Promise<void> {
    const actor = await this.ensureActor();
    const stabilityResult = await actor.check_quantum_stability();
    
    if ('Err' in stabilityResult) {
      throw new Error(stabilityResult.Err);
    }

    if (!stabilityResult.Ok) {
      // Apply stabilizing effect
      await this.applyEffect({
        type: 'dimensional',
        intensity: 1.0,
        duration: 60000, // 1 minute
        signature: `stabilize-${Date.now()}`
      });
    }
  }

  async injectResonance(intensity: number, duration: number): Promise<void> {
    await this.applyEffect({
      type: 'resonance',
      intensity,
      duration,
      signature: `inject-${Date.now()}`
    });

    // Generate new neural patterns after resonance injection
    await this.generateHarmonicPattern();
  }

  async createEntanglement(targetSignature: string): Promise<void> {
    await this.applyEffect({
      type: 'entanglement',
      intensity: 0.8,
      duration: 600000, // 10 minutes
      signature: `entangle-${targetSignature}-${Date.now()}`
    });
  }
}

export const quantumEffectsService = QuantumEffectsService.getInstance();