import {
    analyzeResonancePatterns,
    generateEnhancedResonancePattern,
    calculateQuantumInfluence
} from '../../../utils/analysis/quantum-cognitive';
import { ResonancePattern, QuantumState } from '../../../types/quantum';

describe('Quantum Cognitive Analysis', () => {
    describe('analyzeResonancePatterns', () => {
        it('should analyze resonance patterns correctly', () => {
            const patterns: ResonancePattern[] = [
                { frequency: 432, amplitude: 0.8, phase: 0.5, coherence: 0.9, complexity: 0.7 },
                { frequency: 528, amplitude: 0.6, phase: 0.3, coherence: 0.7, complexity: 0.8 }
            ];

            const { harmony, complexity } = analyzeResonancePatterns(patterns);

            expect(harmony).toBeGreaterThan(0);
            expect(harmony).toBeLessThanOrEqual(1);
            expect(complexity).toBeGreaterThan(0);
            expect(complexity).toBeLessThanOrEqual(1);
        });

        it('should handle empty pattern array', () => {
            const { harmony, complexity } = analyzeResonancePatterns([]);
            expect(harmony).toBe(0);
            expect(complexity).toBe(0);
        });
    });

    describe('generateEnhancedResonancePattern', () => {
        it('should generate valid resonance patterns', () => {
            const baseFrequency = 432;
            const harmonics = [1, 2, 3];

            const patterns = generateEnhancedResonancePattern(baseFrequency, harmonics);

            expect(patterns).toHaveLength(harmonics.length);
            patterns.forEach((pattern, index) => {
                expect(pattern.frequency).toBe(baseFrequency * harmonics[index]);
                expect(pattern.amplitude).toBeGreaterThan(0);
                expect(pattern.amplitude).toBeLessThanOrEqual(1);
                expect(pattern.phase).toBeGreaterThanOrEqual(0);
                expect(pattern.phase).toBeLessThan(2 * Math.PI);
                expect(pattern.coherence).toBeGreaterThan(0);
                expect(pattern.coherence).toBeLessThanOrEqual(1);
                expect(pattern.complexity).toBeGreaterThan(0);
                expect(pattern.complexity).toBeLessThanOrEqual(1);
            });
        });

        it('should maintain harmonic relationships', () => {
            const baseFrequency = 432;
            const harmonics = [1, 2, 4];

            const patterns = generateEnhancedResonancePattern(baseFrequency, harmonics);

            expect(patterns[1].frequency / patterns[0].frequency).toBe(2);
            expect(patterns[2].frequency / patterns[0].frequency).toBe(4);
        });
    });

    describe('calculateQuantumInfluence', () => {
        it('should calculate quantum influence based on state', () => {
            const state: QuantumState = {
                coherenceLevel: 0.8,
                stabilityStatus: 'stable',
                resonancePatterns: [],
                quantumSignature: 'test',
                dimensionalFrequency: 0.6,
                harmonicResonance: 0.7,
                dimensionalDepth: 0.5,
                evolutionFactor: 0.4
            };

            const influence = calculateQuantumInfluence(state);

            expect(influence).toBeGreaterThan(0);
            expect(influence).toBeLessThanOrEqual(1);
        });

        it('should handle edge cases', () => {
            const criticalState: QuantumState = {
                coherenceLevel: 0.1,
                stabilityStatus: 'critical',
                resonancePatterns: [],
                quantumSignature: 'test-critical',
                dimensionalFrequency: 0.2,
                harmonicResonance: 0.1,
                dimensionalDepth: 0.2,
                evolutionFactor: 0.1
            };

            const optimalState: QuantumState = {
                coherenceLevel: 1.0,
                stabilityStatus: 'stable',
                resonancePatterns: [],
                quantumSignature: 'test-optimal',
                dimensionalFrequency: 0.9,
                harmonicResonance: 0.95,
                dimensionalDepth: 0.9,
                evolutionFactor: 0.9
            };

            const criticalInfluence = calculateQuantumInfluence(criticalState);
            const optimalInfluence = calculateQuantumInfluence(optimalState);

            expect(criticalInfluence).toBeLessThan(0.3);
            expect(optimalInfluence).toBeGreaterThan(0.8);
        });
    });
});
