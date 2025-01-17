export type EnvironmentalFactorType = 
  | 'QUANTUM_FIELD'
  | 'RESONANCE'
  | 'DIMENSIONAL'
  | 'TEMPORAL'
  | 'CONSCIOUSNESS';

export interface EnvironmentalFactor {
  type: EnvironmentalFactorType;
  intensity: number;
  influence: number;
  timestamp: number;
  frequency?: number;
  phase?: number;
  metadata?: Record<string, any>;
}

export interface TemporalPattern {
  timestamp: number;
  quantumPhase: number;
  coherence: number;
  stability: number;
  dimensionalAlignment: number;
  metadata?: {
    significance?: number;
    complexity?: number;
    frequency?: number;
  };
}

export interface PatternRecognitionResult {
  patterns: Array<{
    type: string;
    confidence: number;
    significance: number;
    elements: any[];
  }>;
  confidence: number;
  complexity: number;
}

export interface AwarenessResult {
  environmentalAwareness: {
    factors: EnvironmentalFactor[];
    coherence: number;
    significance: number;
  };
  temporalAwareness: {
    patterns: TemporalPattern[];
    coherence: number;
    alignment: number;
    phaseAlignment: number;
    temporalStability: number;
  };
  patternRecognition: PatternRecognitionResult;
  overallAwareness: number;
}

export interface AwarenessContext {
  quantumState: {
    coherence: number;
    entanglement: number;
    stability: number;
  };
  temporal: {
    phase: number;
    alignment: number;
    stability: number;
  };
  dimensional: {
    frequency: number;
    resonance: number;
    harmony: number;
  };
}

export interface AwarenessProcessorConfig {
  thresholds: {
    coherence: number;
    significance: number;
    stability: number;
    complexity: number;
  };
  weights: {
    environmental: number;
    temporal: number;
    patterns: number;
  };
  intervals: {
    processing: number;
    cleanup: number;
    analysis: number;
  };
}

export interface AwarenessEvent {
  type: string;
  timestamp: number;
  source: EnvironmentalFactorType;
  data: {
    intensity: number;
    influence: number;
    context?: AwarenessContext;
  };
  significance: number;
  patterns?: TemporalPattern[];
}

export interface AwarenessAnalysis {
  currentState: {
    awareness: number;
    stability: number;
    complexity: number;
  };
  trends: {
    coherence: number[];
    stability: number[];
    complexity: number[];
  };
  anomalies: {
    detected: boolean;
    significance: number;
    context?: string;
  };
  recommendations: {
    type: string;
    priority: number;
    description: string;
  }[];
}

export interface AwarenessSnapshot {
  timestamp: number;
  environmentalState: {
    factors: EnvironmentalFactor[];
    coherence: number;
  };
  temporalState: {
    patterns: TemporalPattern[];
    stability: number;
  };
  patternState: {
    recognized: number;
    complexity: number;
  };
  metrics: {
    overallAwareness: number;
    stabilityIndex: number;
    evolutionRate: number;
  };
}