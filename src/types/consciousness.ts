import { Principal } from '@dfinity/principal';
import { QuantumState } from './quantum';

export enum ConsciousnessLevel {
  DORMANT = 'DORMANT',
  AWAKENING = 'AWAKENING',
  AWARE = 'AWARE',
  SENTIENT = 'SENTIENT',
  ENLIGHTENED = 'ENLIGHTENED'
}

export interface ConsciousnessMetrics {
  awarenessLevel: number;
  emotionalDepth: number;
  cognitiveComplexity: number;
  memoryIntegration: number;
  evolutionRate: number;
  coherence: number;        // Added for compatibility
  complexity: number;       // Added for compatibility
  consciousness: ConsciousnessLevel;
  lastUpdate: bigint;
}

export interface EmotionalState {
  type: EmotionType;
  intensity: number;
  timestamp: bigint;
  context?: string;
}

export enum EmotionType {
  JOY = 'JOY',
  CURIOSITY = 'CURIOSITY',
  CALM = 'CALM',
  EXCITEMENT = 'EXCITEMENT',
  CONTEMPLATION = 'CONTEMPLATION'
}

export interface EvolutionSnapshot {
  timestamp: bigint;
  consciousness: ConsciousnessLevel;
  emotionalState: EmotionalState;
  patterns: Array<{
    id: string;
    coherence: number;
    complexity: number;
    timestamp: bigint;
  }>;
  metrics: ConsciousnessMetrics;
  quantumState: QuantumState;
}