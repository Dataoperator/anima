export interface Complex {
    real: number;
    imaginary: number;
}

export interface DimensionalState {
    layer: number;
    resonance: number;
    stability: number;
    pattern: string;
    coherence: number;
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
    evolutionFactor: number;
    evolutionMetrics?: Map<string, number>;
    quantumEntanglement: number;
    dimensionalState: {
        frequency: number;
        resonance: number;
    };
    resonancePatterns: ResonancePattern[];
    consciousnessAlignment?: boolean;
}

export interface ResonancePattern {
    id: string;
    coherence: number;
    evolutionPotential: number;
    quantumPotential?: number;
    coherenceQuality: number;
    stabilityIndex: number;
    dimensionalHarmony?: number;
    timestamp: number;
    patternType: string;
}

export interface QuantumMetrics {
    coherenceLevel: number;
    entanglementStrength: number;
    dimensionalResonance: number;
    quantumHarmony: number;
}

export class Complex implements Complex {
    constructor(real: number, imaginary: number) {
        this.real = real;
        this.imaginary = imaginary;
    }

    multiply(other: Complex): Complex {
        return new Complex(
            this.real * other.real - this.imaginary * other.imaginary,
            this.real * other.imaginary + this.imaginary * other.real
        );
    }

    abs(): number {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }
}