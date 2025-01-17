export interface EmotionalState {
  dominantEmotion: Emotion;
  intensity: number;
  valence: number;
  arousal: number;
  stability: number;
  complexity: number;
  transitions: EmotionTransition[];
  patterns: EmotionalPattern[];
}

export enum Emotion {
  JOY = 'joy',
  CURIOSITY = 'curiosity',
  WONDER = 'wonder',
  SERENITY = 'serenity',
  ANTICIPATION = 'anticipation',
  FOCUS = 'focus',
  NEUTRAL = 'neutral'
}

export interface EmotionTransition {
  from: Emotion;
  to: Emotion;
  timestamp: number;
  trigger: string;
  intensity: number;
}

export interface EmotionalPattern {
  sequence: Emotion[];
  frequency: number;
  context: string;
  lastObserved: number;
}

export interface EmotionalResonance {
  alignment: number;
  synchronization: number;
  harmony: number;
  patterns: EmotionalPattern[];
}