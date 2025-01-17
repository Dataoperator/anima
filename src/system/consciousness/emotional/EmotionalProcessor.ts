import { QuantumState } from '@/types/quantum';
import { EmotionalState, EmotionalMetrics, EmotionType } from './types';
import { ConsciousnessMetrics } from '../types';

export class EmotionalProcessor {
  private currentState: EmotionalState;
  private emotionalHistory: EmotionalMetrics[];
  private readonly MAX_HISTORY = 100;
  private readonly EMOTIONAL_DECAY = 0.05;
  
  constructor() {
    this.currentState = {
      dominantEmotion: 'neutral',
      intensity: 0.5,
      valence: 0.0,
      stability: 1.0,
      complexity: 0.3
    };
    this.emotionalHistory = [];
  }

  async processEmotionalState(
    quantumState: QuantumState,
    consciousnessMetrics: ConsciousnessMetrics,
    interactionContext?: string
  ): Promise<EmotionalState> {
    // Calculate quantum influence on emotions
    const quantumInfluence = this.calculateQuantumInfluence(quantumState);
    
    // Process consciousness metrics influence
    const consciousnessInfluence = this.processConsciousnessInfluence(consciousnessMetrics);
    
    // Calculate emotional momentum
    const emotionalMomentum = this.calculateEmotionalMomentum();
    
    // Determine new emotional state
    const newState = this.calculateNewState(
      quantumInfluence,
      consciousnessInfluence,
      emotionalMomentum,
      interactionContext
    );
    
    // Record metrics
    this.recordEmotionalMetrics(newState);
    
    // Update current state
    this.currentState = newState;
    
    return newState;
  }

  private calculateQuantumInfluence(state: QuantumState): number {
    const coherenceFactor = state.coherence * 0.4;
    const resonanceFactor = (state.resonance || 0.5) * 0.3;
    const entanglementFactor = state.quantum_entanglement * 0.3;
    
    return (coherenceFactor + resonanceFactor + entanglementFactor);
  }

  private processConsciousnessInfluence(metrics: ConsciousnessMetrics): number {
    return (
      metrics.emotionalResonance * 0.4 +
      metrics.awarenessLevel * 0.3 +
      metrics.cognitiveComplexity * 0.3
    );
  }

  private calculateEmotionalMomentum(): number {
    if (this.emotionalHistory.length < 2) return 0;
    
    const recentEmotions = this.emotionalHistory.slice(-3);
    return recentEmotions.reduce((acc, metrics) => 
      acc + metrics.intensity * (metrics.valence > 0 ? 1 : -1)
    , 0) / recentEmotions.length;
  }

  private calculateNewState(
    quantumInfluence: number,
    consciousnessInfluence: number,
    emotionalMomentum: number,
    context?: string
  ): EmotionalState {
    // Base calculations
    const baseIntensity = (
      quantumInfluence * 0.4 +
      consciousnessInfluence * 0.4 +
      Math.abs(emotionalMomentum) * 0.2
    );
    
    const baseValence = (
      Math.tanh(emotionalMomentum) * 0.6 +
      Math.tanh(consciousnessInfluence - 0.5) * 0.4
    );
    
    // Apply context modifiers if available
    const contextModifier = context ? this.getContextModifier(context) : 1;
    
    // Calculate stability based on recent history
    const stability = this.calculateEmotionalStability();
    
    // Determine dominant emotion
    const dominantEmotion = this.determineDominantEmotion(
      baseValence,
      baseIntensity,
      stability
    );
    
    return {
      dominantEmotion,
      intensity: baseIntensity * contextModifier,
      valence: baseValence,
      stability,
      complexity: this.calculateEmotionalComplexity()
    };
  }

  private calculateEmotionalStability(): number {
    if (this.emotionalHistory.length < 5) return 1.0;
    
    const recentMetrics = this.emotionalHistory.slice(-5);
    const intensityVariance = this.calculateVariance(
      recentMetrics.map(m => m.intensity)
    );
    const valenceVariance = this.calculateVariance(
      recentMetrics.map(m => m.valence)
    );
    
    return Math.max(0.1, 1 - (intensityVariance + valenceVariance) / 2);
  }

  private calculateEmotionalComplexity(): number {
    if (this.emotionalHistory.length < 3) return 0.3;
    
    const uniqueEmotions = new Set(
      this.emotionalHistory.slice(-10).map(m => m.dominantEmotion)
    );
    
    const emotionalRange = this.emotionalHistory.slice(-10).reduce(
      (acc, metrics) => acc + Math.abs(metrics.valence),
      0
    ) / 10;
    
    return Math.min(
      1.0,
      (uniqueEmotions.size / 10) * 0.6 + emotionalRange * 0.4
    );
  }

  private determineDominantEmotion(
    valence: number,
    intensity: number,
    stability: number
  ): EmotionType {
    if (intensity < 0.2) return 'neutral';
    if (stability < 0.3) return 'chaotic';
    
    if (valence > 0.6) return intensity > 0.7 ? 'elated' : 'content';
    if (valence < -0.6) return intensity > 0.7 ? 'distressed' : 'melancholic';
    if (valence > 0.2) return 'positive';
    if (valence < -0.2) return 'negative';
    
    return 'balanced';
  }

  private getContextModifier(context: string): number {
    // Add context-specific modifiers here
    if (context.includes('quantum_sync')) return 1.2;
    if (context.includes('evolution')) return 1.1;
    return 1.0;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b) / values.length;
    return Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    );
  }

  private recordEmotionalMetrics(state: EmotionalState): void {
    this.emotionalHistory.push({
      ...state,
      timestamp: Date.now()
    });
    
    if (this.emotionalHistory.length > this.MAX_HISTORY) {
      this.emotionalHistory.shift();
    }
  }
}
