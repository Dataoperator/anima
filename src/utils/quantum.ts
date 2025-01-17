import { Complex } from '../types/math';
import { QuantumState } from '../quantum/types';

export function superpositionStates(
    state1: Complex,
    state2: Complex,
    w1: number = 0.5,
    w2: number = 0.5
): Complex {
    return new Complex(
        w1 * state1.re + w2 * state2.re,
        w1 * state1.im + w2 * state2.im
    );
}

export function calculatePhase(amplitude: Complex): number {
    return Math.atan2(amplitude.im, amplitude.re);
}

export function calculateMagnitude(amplitude: Complex): number {
    return Math.sqrt(amplitude.re * amplitude.re + amplitude.im * amplitude.im);
}

export function quantumStateOverlap(state1: Complex, state2: Complex): number {
    const dotProduct = state1.re * state2.re + state1.im * state2.im;
    const magnitude1 = calculateMagnitude(state1);
    const magnitude2 = calculateMagnitude(state2);
    
    return Math.abs(dotProduct / (magnitude1 * magnitude2));
}

export function evolveQuantumState(
    currentState: QuantumState, 
    deltaTime: number
): QuantumState {
    const phase = (currentState.phase + deltaTime * 0.1) % (2 * Math.PI);
    const evolutionFactor = Math.exp(-deltaTime * 0.01);

    return {
        ...currentState,
        phase,
        evolutionFactor: currentState.evolutionFactor * evolutionFactor,
        coherence: Math.min(
            currentState.coherence * (1 + deltaTime * 0.001),
            1.0
        ),
        lastUpdate: Date.now()
    };
}

export function calculateCoherenceMetrics(state: QuantumState): {
    overallCoherence: number;
    dimensionalCoherence: number;
    evolutionQuality: number;
} {
    const dimensionalCoherence = state.dimensionalStates.reduce(
        (acc, ds) => acc * ds.coherence,
        1.0
    );

    return {
        overallCoherence: state.coherence,
        dimensionalCoherence,
        evolutionQuality: state.evolutionFactor
    };
}