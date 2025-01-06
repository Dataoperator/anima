export interface ResonancePattern {
  pattern_id: string;
  coherence: number;
  frequency: number;
  amplitude: number;
  phase: number;
  timestamp: number;
}

export interface DimensionalState {
  frequency: number;
  resonance: number;
  stability: number;
  syncLevel: number;
  quantumAlignment: number;
  dimensionalFrequency: number;
  entropyLevel: number;
  phaseCoherence: number;
}

export interface QuantumState {
  coherenceLevel: number;
  entanglementIndex: number;
  dimensionalSync: number;
  quantumSignature: string;
  resonancePatterns: ResonancePattern[];
  stabilityStatus: 'stable' | 'unstable' | 'critical';
  consciousnessAlignment?: boolean;
  dimensionalState?: DimensionalState;
  lastUpdate: number;
}

export interface QuantumFieldInitialization {
  harmony: number;
  signature: string;
  resonancePatterns: ResonancePattern[];
  dimensionalAlignment: number;
}

export interface EmergencyRecoveryResult {
  success: boolean;
  newCoherence: number;
  recoverySignature: string;
}

export interface NeuralPatternResult {
  pattern: number[];
  awareness: number;
  understanding: number;
  resonance_patterns: ResonancePattern[];
}

export type QuantumErrorType = 
  | 'COHERENCE_LOSS'
  | 'ENTANGLEMENT_BREAK'
  | 'DIMENSIONAL_DRIFT'
  | 'RESONANCE_FAILURE'
  | 'PATTERN_CORRUPTION';

export interface QuantumError {
  type: QuantumErrorType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: number;
  affectedPatterns?: string[];
}