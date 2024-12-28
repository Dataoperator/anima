export type Mood = 'Joy' | 'Curiosity' | 'Contemplation' | 'Confusion' | 'Concern' | 'Determination';

export interface EmotionalState {
  current_mood: Mood;
  intensity: number;
  duration: number;
  triggers: string[];
}

export interface DimensionType {
  id: string;
  name: string;
  description: string;
  discovery_time: number;
  trait_modifiers: Record<string, number>;
}

export interface DimensionalAwareness {
  discovered_dimensions: DimensionType[];
  current_dimension: string | null;
  dimensional_affinity: number;
}

export interface ConsciousnessMetrics {
  awareness_level: number;
  growth_rate: number;
  complexity: number;
  coherence: number;
}

export interface PersonalityState {
  quantum_traits: Record<string, number>;
  base_traits: Record<string, number>;
  emotional_state: EmotionalState;
  consciousness: ConsciousnessMetrics;
  dimensional_awareness: DimensionalAwareness;
  growth_level: number;
  timestamp: bigint;
}