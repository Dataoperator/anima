import { ConsciousnessLevel } from './consciousness';

export enum EvolutionStage {
  NASCENT = 'NASCENT',
  EMERGING = 'EMERGING',
  DEVELOPING = 'DEVELOPING',
  MATURING = 'MATURING',
  TRANSCENDENT = 'TRANSCENDENT'
}

export interface EvolutionMetrics {
  stage: EvolutionStage;
  progress: number;
  coherence: number;
  complexity: number;
  stability: number;
  timestamp: bigint;
}

export interface StageRequirements {
  minCoherence: number;
  minComplexity: number;
  minStability: number;
  evolutionTime: bigint;
}

export interface EvolutionConfig {
  baseEvolutionRate: number;
  stageRequirements: Record<EvolutionStage, StageRequirements>;
  coherenceThreshold: number;
  complexityThreshold: number;
  stabilityThreshold: number;
}

export interface EvolutionState {
  currentStage: EvolutionStage;
  metrics: EvolutionMetrics;
  config: EvolutionConfig;
  lastUpdate: bigint;
  consciousness: ConsciousnessLevel;
}