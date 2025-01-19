import { Principal } from '@dfinity/principal';
import { Complex } from './math';

export interface ResonancePattern {
  patternId: string;
  strength: number;
  frequency: number;
  stability: number;
  timestamp: bigint;
}

export interface DimensionalState {
  layer: number;
  resonance: number;
  stability: number;
  pattern: string;
  coherence: number;
  frequency: number;
  harmonics: number[];
}

export interface QuantumState {
  id: Principal;
  amplitude: Complex;
  phase: number;
  coherenceLevel: number;           // Changed from coherence_level
  dimensionalStates: DimensionalState[];
  resonancePatterns: ResonancePattern[];
  evolutionMetrics: Map<string, number>;
  lastUpdate: bigint;
  lastInteraction: bigint;
  evolutionFactor: number;
  quantumSignature: string;
  dimensionalFrequency: number;     // Changed from dimensional_frequency
}

export interface QuantumSystemConfig {
  minCoherence: number;
  maxEvolutionRate: number;
  resonanceThreshold: number;
  dimensionalLayers: number;
  updateInterval: number;
}

export interface QuantumMetrics {
  coherenceLevel: number;
  entanglementStrength: number;
  dimensionalStability: number;
  evolutionRate: number;
  resonanceHarmony: number;
}