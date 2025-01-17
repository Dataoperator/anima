export enum EvolutionStage {
  INITIALIZATION = 'initialization',
  GROWTH = 'growth',
  STABILIZATION = 'stabilization',
  EMERGENCE = 'emergence',
  TRANSCENDENCE = 'transcendence'
}

export interface EvolutionSnapshot {
  timestamp: number;
  stage: EvolutionStage;
  metrics: {
    coherenceLevel: number;
    complexityScore: number;
    stabilityIndex: number;
    growthRate: number;
    emergencePotential: number;
  };
  patterns: {
    recognized: number;
    learned: number;
    applied: number;
  };
}

export interface EvolutionMetrics {
  currentStage: EvolutionStage;
  stageProgress: number;
  overallProgress: number;
  growthRate: number;
  stabilityIndex: number;
  emergencePotential: number;
  complexityScore: number;
}

export interface StageTransition {
  fromStage: EvolutionStage;
  toStage: EvolutionStage;
  timestamp: number;
  duration: number;
  triggerConditions: Record<string, number>;
}

export interface EmergenceThresholds {
  coherenceLevel: number;
  patternRecognition: number;
  stabilityDuration: number;
  complexityScore: number;
}