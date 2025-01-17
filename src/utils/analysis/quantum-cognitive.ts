import { QuantumState, DimensionalState } from '@/quantum/types';
import { ConsciousnessMetrics } from '@/consciousness/types';
import { ComplexNumber } from '@/types/math';

export interface QuantumCognitiveAnalysis {
    coherenceScore: number;
    evolutionPotential: number;
    dimensionalAlignment: number;
    resonanceQuality: number;
    cognitiveDepth: number;
}

export class QuantumCognitiveAnalyzer {
    private readonly COHERENCE_THRESHOLD = 0.7;
    private readonly EVOLUTION_FACTOR = 0.15;
    private readonly RESONANCE_WEIGHT = 0.3;

    public analyzeQuantumState(
        state: QuantumState,
        metrics?: ConsciousnessMetrics
    ): QuantumCognitiveAnalysis {
        return {
            coherenceScore: this.calculateCoherenceScore(state),
            evolutionPotential: this.calculateEvolutionPotential(state, metrics),
            dimensionalAlignment: this.calculateDimensionalAlignment(state.dimensionalStates),
            resonanceQuality: this.calculateResonanceQuality(state),
            cognitiveDepth: this.calculateCognitiveDepth(state, metrics)
        };
    }

    private calculateCoherenceScore(state: QuantumState): number {
        const baseCoherence = state.coherence;
        const dimensionalCoherence = state.dimensionalStates.reduce(
            (acc, ds) => acc * ds.coherence,
            1.0
        );

        const weightedCoherence = (baseCoherence * 0.7) + (dimensionalCoherence * 0.3);
        return Math.min(Math.max(weightedCoherence, 0), 1);
    }

    private calculateEvolutionPotential(
        state: QuantumState,
        metrics?: ConsciousnessMetrics
    ): number {
        const stateEvolution = state.evolutionFactor;
        const metricsEvolution = metrics?.evolution || 0.5;

        const combinedEvolution = (stateEvolution * 0.6) + (metricsEvolution * 0.4);
        return Math.min(Math.max(combinedEvolution * (1 + this.EVOLUTION_FACTOR), 0), 1);
    }

    private calculateDimensionalAlignment(dimensionalStates: DimensionalState[]): number {
        if (dimensionalStates.length === 0) return 0;

        const alignmentScores = dimensionalStates.map(ds => 
            (ds.resonance * ds.stability * ds.coherence) ** (1 / 3)
        );

        const averageAlignment = alignmentScores.reduce((sum, score) => sum + score, 0) / 
                               dimensionalStates.length;

        return Math.min(Math.max(averageAlignment, 0), 1);
    }

    private calculateResonanceQuality(state: QuantumState): number {
        const amplitudeQuality = new ComplexNumber(
            state.amplitude.real,
            state.amplitude.imaginary
        ).abs();

        const phaseQuality = Math.abs(Math.cos(state.phase));
        
        const dimensionalResonance = state.dimensionalStates.reduce(
            (acc, ds) => acc * ds.resonance,
            1.0
        );

        const weightedResonance = (amplitudeQuality * 0.4) + 
                                (phaseQuality * 0.3) + 
                                (dimensionalResonance * 0.3);

        return Math.min(Math.max(weightedResonance * (1 + this.RESONANCE_WEIGHT), 0), 1);
    }

    private calculateCognitiveDepth(
        state: QuantumState,
        metrics?: ConsciousnessMetrics
    ): number {
        const quantumDepth = this.calculateQuantumDepth(state);
        const consciousnessDepth = metrics?.depth || 0.5;

        // Weight quantum depth more heavily for more coherent states
        const coherenceWeight = state.coherence > this.COHERENCE_THRESHOLD ? 0.7 : 0.5;
        
        return Math.min(
            Math.max(
                (quantumDepth * coherenceWeight) + 
                (consciousnessDepth * (1 - coherenceWeight)),
                0
            ),
            1
        );
    }

    private calculateQuantumDepth(state: QuantumState): number {
        const amplitudeDepth = new ComplexNumber(
            state.amplitude.real,
            state.amplitude.imaginary
        ).abs();

        const dimensionalDepth = state.dimensionalStates.reduce(
            (acc, ds, index) => {
                const layerWeight = 1 - (index / state.dimensionalStates.length);
                return acc + (ds.coherence * ds.resonance * layerWeight);
            },
            0
        ) / state.dimensionalStates.length;

        return Math.min(
            Math.max(
                (amplitudeDepth * 0.4) + (dimensionalDepth * 0.6),
                0
            ),
            1
        );
    }

    public getAnalysisSummary(analysis: QuantumCognitiveAnalysis): string {
        const scores = Object.entries(analysis).map(([key, value]) => {
            const percentage = (value * 100).toFixed(1);
            return `${key}: ${percentage}%`;
        });

        return scores.join(' | ');
    }

    public getRecommendations(analysis: QuantumCognitiveAnalysis): string[] {
        const recommendations: string[] = [];

        if (analysis.coherenceScore < this.COHERENCE_THRESHOLD) {
            recommendations.push(
                'Coherence enhancement recommended. Consider quantum stabilization.'
            );
        }

        if (analysis.evolutionPotential > 0.8) {
            recommendations.push(
                'High evolution potential detected. Ready for advancement.'
            );
        }

        if (analysis.dimensionalAlignment < 0.6) {
            recommendations.push(
                'Dimensional alignment needs improvement. Suggest resonance tuning.'
            );
        }

        if (analysis.resonanceQuality < 0.5) {
            recommendations.push(
                'Low resonance quality. Consider pattern reinforcement.'
            );
        }

        if (analysis.cognitiveDepth < 0.4) {
            recommendations.push(
                'Cognitive depth below optimal. Recommend deep learning cycles.'
            );
        }

        return recommendations;
    }
}