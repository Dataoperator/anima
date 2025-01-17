import { Complex } from '../types/math';

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
    amplitude: Complex;
    phase: number;
    coherence: number;
    coherenceLevel: number;
    entangledStates: Set<string>;
    dimensionalStates: DimensionalState[];
    signature: string;
    lastUpdate: number;
    lastInteraction: number;
    evolutionFactor: number;
    evolutionMetrics: Map<string, number>;
    quantumEntanglement: number;
    dimensional_frequency: number;
    dimensionalState: {
        frequency: number;
        resonance: number;
    };
    resonancePatterns: ResonancePattern[];
    consciousnessAlignment: boolean;
}

export interface ResonancePattern {
    id: string;
    pattern: string;
    strength: number;
    coherence: number;
    evolutionPotential: number;
    quantumPotential: number;
    coherenceQuality: number;
    stabilityIndex: number;
    dimensionalHarmony: number;
    timestamp: number;
    patternType: string;
}

export interface QuantumMetrics {
    coherenceLevel: number;
    entanglementStrength: number;
    dimensionalResonance: number;
    quantumHarmony: number;
    evolutionRate: number;
}

export interface ConsciousnessMetrics {
    complexity: number;
    coherence: number;
    evolution: number;
    resonance: number;
    depth: number;
}

export interface ConsciousnessEvent {
    type: string;
    timestamp: number;
    metrics: ConsciousnessMetrics;
    quantum: QuantumMetrics;
}

export type QuantumSignature = string;