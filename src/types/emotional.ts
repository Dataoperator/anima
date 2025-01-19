export enum EmotionType {
  JOY = 'JOY',
  CURIOSITY = 'CURIOSITY',
  CALM = 'CALM',
  EXCITEMENT = 'EXCITEMENT',
  CONTEMPLATION = 'CONTEMPLATION',
  NEUTRAL = 'NEUTRAL'
}

export interface EmotionalSignature {
  type: EmotionType;
  intensity: number;
  timestamp: bigint;
}

export interface Emotion {
  type: EmotionType;
  intensity: number;
  timestamp: bigint;
  context?: string;
}

export interface EmotionalState {
  dominant: Emotion;
  secondary?: Emotion;
  lastUpdate: bigint;
  history: Emotion[];
}