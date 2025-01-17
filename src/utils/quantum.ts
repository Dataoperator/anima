import { Complex } from '../types/quantum';
import { QuantumSignature } from '../quantum/types';

/**
 * Generates a unique quantum signature for state identification
 */
export function generateQuantumSignature(): string {
    const timestamp = Date.now();
    const randomComponent = Math.random().toString(36).substring(2, 15);
    const quantumNoise = generateQuantumNoise();
    return `${timestamp}-${randomComponent}-${quantumNoise}`;
}

/**
 * Generates simulated quantum noise for signature entropy
 */
function generateQuantumNoise(): string {
    const noise = new Uint8Array(16);
    crypto.getRandomValues(noise);
    return Array.from(noise)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Calculates quantum phase angle between two states
 */
export function calculatePhaseAngle(state1: Complex, state2: Complex): number {
    return Math.atan2(
        state1.im * state2.re - state1.re * state2.im,
        state1.re * state2.re + state1.im * state2.im
    );
}

/**
 * Applies quantum decoherence effects
 */
export function applyDecoherence(amplitude: Complex, decoherenceFactor: number): Complex {
    const magnitude = Math.sqrt(amplitude.re * amplitude.re + amplitude.im * amplitude.im);
    const phase = Math.atan2(amplitude.im, amplitude.re);
    
    const newMagnitude = magnitude * Math.exp(-decoherenceFactor);
    return new Complex(
        newMagnitude * Math.cos(phase),
        newMagnitude * Math.sin(phase)
    );
}

/**
 * Validates a quantum signature
 */
export function validateQuantumSignature(signature: string): boolean {
    const parts = signature.split('-');
    if (parts.length !== 3) return false;
    
    const timestamp = parseInt(parts[0]);
    if (isNaN(timestamp)) return false;
    
    const hexPattern = /^[0-9a-f]{32}$/i;
    if (!hexPattern.test(parts[2])) return false;
    
    return true;
}

/**
 * Calculates dimensional resonance between states
 */
export function calculateResonance(state1: Complex, state2: Complex): number {
    const dotProduct = state1.re * state2.re + state1.im * state2.im;
    const magnitude1 = Math.sqrt(state1.re * state1.re + state1.im * state1.im);
    const magnitude2 = Math.sqrt(state2.re * state2.re + state2.im * state2.im);
    
    return Math.abs(dotProduct / (magnitude1 * magnitude2));
}

/**
 * Creates a quantum superposition of two states
 */
export function createSuperposition(state1: Complex, state2: Complex, weight: number): Complex {
    const w1 = Math.sqrt(weight);
    const w2 = Math.sqrt(1 - weight);
    
    return new Complex(
        w1 * state1.re + w2 * state2.re,
        w1 * state1.im + w2 * state2.im
    );
}

/**
 * Estimates quantum state coherence
 */
export function estimateCoherence(state: Complex, referenceState: Complex): number {
    const fidelity = calculateResonance(state, referenceState);
    return Math.pow(fidelity, 2);
}