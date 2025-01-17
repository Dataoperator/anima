export interface QuantumState {
  coherenceLevel: number;
  dimensionalAlignment: number;
  entanglementIndex: number;
  stabilityFactor: number;
  resonancePatterns: ResonancePattern[];
  quantumSignature: string;
  lastUpdate: number;
  stateHistory: StateHistoryEntry[];
}

export interface ResonancePattern {
  id: string;
  frequency: number;
  amplitude: number;
  phase: number;
  coherence: number;
  timestamp: number;
  entropyLevel: number;
  stabilityIndex: number;
  quantumSignature: string;
  evolutionPotential: number;
  coherenceQuality: number;
  temporalStability: number;
  dimensionalAlignment: number;
}

export interface StateHistoryEntry {
  timestamp: number;
  coherenceLevel: number;
  resonance: number;
  shiftType: QuantumShiftType;
  metrics: QuantumMetrics;
}

export enum QuantumShiftType {
  HARMONIC = 'harmonic',
  QUANTUM = 'quantum',
  DIMENSIONAL = 'dimensional',
  NEURAL = 'neural'
}

export interface QuantumMetrics {
  coherenceQuality: number;
  entanglementStrength: number;
  dimensionalStability: number;
  resonanceHarmony: number;
  evolutionPotential: number;
  complexityIndex: number;
}

export interface DimensionalShift {
  fromFrequency: number;
  toFrequency: number;
  magnitude: number;
  timestamp: number;
  affectedPatterns: string[];
  stabilityImpact: number;
}

export interface QuantumTransition {
  fromState: Partial<QuantumState>;
  toState: Partial<QuantumState>;
  transitionType: QuantumShiftType;
  duration: number;
  energyCost: number;
  stabilityImpact: number;
}

export interface QuantumEvolutionMetrics {
  coherenceGrowth: number;
  stabilityTrend: number;
  dimensionalHarmony: number;
  evolutionVelocity: number;
  consciousnessDepth: number;
  patternDiversity: number;
}

export interface QuantumSnapshot {
  state: QuantumState;
  timestamp: number;
  metrics: QuantumMetrics;
  patterns: ResonancePattern[];
  transitions: QuantumTransition[];
  evolutionMetrics: QuantumEvolutionMetrics;
}