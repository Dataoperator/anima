export interface ResonancePattern {
  frequency: number;
  amplitude: number;
  phase: number;
}

export type StabilityStatus = 'initializing' | 'stable' | 'unstable' | 'critical' | 'recovering' | 'stabilizing';

export interface QuantumState {
  coherenceLevel: number;        // 0-1: Overall quantum field coherence
  entanglementIndex: number;     // 0-1: Degree of quantum entanglement
  dimensionalSync: number;       // 0-1: Dimensional synchronization level
  quantumSignature: string;      // Unique quantum signature
  resonancePatterns: ResonancePattern[];
  stabilityStatus: StabilityStatus;
  lastUpdate: number;
}

export interface EnhancedQuantumState extends QuantumState {
  harmonicResonance: number;     // 0-1: Harmonic field strength
  dimensionalDepth: number;      // 0-1: Depth of dimensional integration
  evolutionFactor: number;       // 0-1: Rate of quantum evolution
  synchronizationField: number[];// Field values for multi-dimensional sync
  quantumMemory: Map<string, any>; // Persistent quantum state memory
}

export interface QuantumEffect {
  type: 'resonance' | 'entanglement' | 'dimensional';
  intensity: number;  // 0-1: Effect strength
  duration: number;   // Duration in milliseconds
}

export interface EvolutionMetrics {
  coherenceGrowth: number;
  patternComplexity: number;
  evolutionRate: number;
  stabilityIndex: number;
}

export interface NeuralSyncState {
  syncLevel: number;
  patternStrength: number;
  connectionDensity: number;
  harmonicAlignment?: number;    // New: Alignment with harmonic fields
  evolutionProgress?: number;    // New: Neural evolution progress
  dimensionalReach?: number;     // New: Reach across dimensional planes
}

export interface QuantumSignatureConfig {
  complexity: number;
  dimensions: number;
  entropyLevel: number;
  harmonicFactors?: number[];    // New: Harmonic frequency factors
  resonanceThresholds?: number[];// New: Threshold for resonance patterns
}

export interface DimensionalMetrics {
  depth: number;
  coherence: number;
  evolution: number;
  harmonics: number[];
  stabilityMatrix: number[][];
}

export interface ResonanceMemory {
  patterns: ResonancePattern[];
  timestamp: number;
  stabilityScore: number;
  harmonicProfile: number[];
}

export interface QuantumRecoveryState {
  lastStableState: QuantumState;
  recoveryAttempts: number;
  stabilityHistory: StabilityStatus[];
  recoveryPatterns: ResonancePattern[];
}

export type QuantumFieldMode = 
  | 'standard'
  | 'enhanced'
  | 'recovery'
  | 'evolution'
  | 'harmonicSync'
  | 'dimensionalShift';

export interface HarmonicResonanceConfig {
  baseFrequency: number;
  harmonicSeries: number[];
  amplitudeModulation: number;
  phaseAlignment: number;
  coherenceThreshold: number;
}

export interface EvolutionaryParameters {
  baseRate: number;
  complexityFactor: number;
  harmonicInfluence: number;
  dimensionalCoupling: number;
  stabilityThreshold: number;
}