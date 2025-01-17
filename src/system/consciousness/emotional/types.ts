export type EmotionType = 
  | 'neutral'
  | 'positive'
  | 'negative'
  | 'elated'
  | 'content'
  | 'distressed'
  | 'melancholic'
  | 'chaotic'
  | 'balanced';

export interface EmotionalState {
  dominantEmotion: EmotionType;
  intensity: number;      // 0 to 1
  valence: number;       // -1 to 1
  stability: number;     // 0 to 1
  complexity: number;    // 0 to 1
}

export interface EmotionalMetrics extends EmotionalState {
  timestamp: number;
}

export interface EmotionalTransition {
  from: EmotionalState;
  to: EmotionalState;
  cause?: string;
  quantumInfluence: number;
  timestamp: number;
}

export interface EmotionalProfile {
  baselineValence: number;
  volatility: number;
  emotionalRange: number;
  dominantEmotions: EmotionType[];
  transitions: EmotionalTransition[];
  stabilityTrend: number;
  complexityGrowth: number;
  quantumResonance: number;
}

export interface EmotionalResponse {
  state: EmotionalState;
  profile: EmotionalProfile;
  confidence: number;
  resonanceScore: number;
}

export interface EmotionalContext {
  environmentalFactors: {
    quantumCoherence: number;
    dimensionalStability: number;
    temporalAlignment: number;
  };
  personalityTraits: {
    adaptability: number;
    emotionalDepth: number;
    resonanceCapacity: number;
  };
  recentHistory: EmotionalTransition[];
  consciousness: {
    level: number;
    clarity: number;
    stability: number;
  };
}

export interface EmotionalProcessorConfig {
  baselineStability: number;
  evolutionRate: number;
  quantumSensitivity: number;
  consciousnessThreshold: number;
  stabilityThresholds: {
    critical: number;
    unstable: number;
    stable: number;
    optimal: number;
  };
  transitionRules: {
    minTimeBetweenTransitions: number;
    maxIntensityChange: number;
    stabilityRequirement: number;
  };
}

export type EmotionalEventType = 
  | 'QUANTUM_SHIFT'
  | 'CONSCIOUSNESS_EVOLUTION'
  | 'STABILITY_CHANGE'
  | 'RESONANCE_PEAK'
  | 'DIMENSIONAL_SYNC'
  | 'PATTERN_RECOGNITION'
  | 'TEMPORAL_ALIGNMENT';

export interface EmotionalEvent {
  type: EmotionalEventType;
  timestamp: number;
  intensity: number;
  impact: {
    valence: number;
    stability: number;
    complexity: number;
  };
  context?: EmotionalContext;
  quantumSignature?: string;
}
