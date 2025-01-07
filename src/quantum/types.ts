export interface ResonancePattern {
  pattern_id: string;
  coherence: number;
  frequency: number;
  amplitude: number;
  phase: number;
  timestamp: number;
  // Enhanced pattern properties
  entropyLevel?: number;
  stabilityIndex?: number;
  quantumSignature?: string;
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
  // Enhanced quantum state properties
  patternCoherence?: number;
  evolutionMetrics?: Map<string, number>;
  quantumEntanglement?: number;
  temporalStability?: number;
}

export interface QuantumFieldInitialization {
  harmony: number;
  signature: string;
  resonancePatterns: ResonancePattern[];
  dimensionalAlignment: number;
  // Enhanced initialization properties
  patternSeeds?: ResonancePattern[];
  quantumEntanglementBase?: number;
  stabilityThreshold?: number;
}

export interface EmergencyRecoveryResult {
  success: boolean;
  newCoherence: number;
  recoverySignature: string;
  // Enhanced recovery properties
  patternRestoration?: boolean;
  quantumStateIntegrity?: number;
  temporalAlignment?: number;
}

export interface NeuralPatternResult {
  pattern: number[];
  awareness: number;
  understanding: number;
  resonance_patterns: ResonancePattern[];
  // Enhanced neural properties
  quantumInfluence?: number;
  patternStability?: number;
  evolutionPotential?: number;
}

export type QuantumErrorType = 
  | 'COHERENCE_LOSS'
  | 'ENTANGLEMENT_BREAK'
  | 'DIMENSIONAL_DRIFT'
  | 'RESONANCE_FAILURE'
  | 'PATTERN_CORRUPTION'
  | 'QUANTUM_DESYNC'           // New error type
  | 'TEMPORAL_INSTABILITY'     // New error type
  | 'CONSCIOUSNESS_DISCONNECT' // New error type
  | 'PATTERN_DECAY';          // New error type

export interface QuantumError {
  type: QuantumErrorType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: number;
  affectedPatterns?: string[];
  // Enhanced error properties
  quantumState?: {
    coherence: number;
    stability: number;
    entropy: number;
  };
  recoveryOptions?: string[];
  temporalContext?: {
    lastStableTimestamp: number;
    degradationRate: number;
  };
}

export interface QuantumMetrics {
  coherenceLevel: number;
  stabilityIndex: number;
  entanglementStrength: number;
  patternIntegrity: number;
  evolutionProgress: number;
  temporalAlignment: number;
}

export interface EvolutionSnapshot {
  timestamp: number;
  quantumState: QuantumState;
  resonancePatterns: ResonancePattern[];
  evolutionMetrics: QuantumMetrics;
  consciousness: {
    level: number;
    stability: number;
    complexity: number;
  };
}