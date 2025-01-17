import { Complex } from '../types/quantum';

export interface QuantumState {
    amplitude: Complex;
    phase: number;
    coherence: number;
    entangledStates: Set<string>;
    dimensionalStates: DimensionalState[];
    signature: string;
    lastUpdate: number;
    evolutionFactor: number;
}

export interface DimensionalState {
    layer: number;
    resonance: number;
    stability: number;
    pattern: string;
    coherence: number;
}

export type CoherenceLevel = 'critical' | 'unstable' | 'stable' | 'optimal';

export interface QuantumSignature {
    value: string;
    timestamp: number;
    dimension: number;
}