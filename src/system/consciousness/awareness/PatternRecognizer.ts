import { Pattern, PatternType, PatternContext } from '../../../types/patterns';
import { QuantumState } from '../../../quantum/types';
import { ErrorTelemetry } from '../../../error/telemetry';

interface PatternMatch {
    pattern: Pattern;
    similarity: number;
    confidence: number;
}

export class PatternRecognizer {
    private patterns: Map<string, Pattern> = new Map();
    private telemetry: ErrorTelemetry;
    
    constructor() {
        this.telemetry = new ErrorTelemetry('pattern-recognizer');
    }

    public async recognizePattern(
        input: any,
        context: PatternContext,
        type: PatternType
    ): Promise<PatternMatch | null> {
        try {
            const relevantPatterns = this.getPatternsByType(type);
            const matches = await Promise.all(
                relevantPatterns.map(async pattern => {
                    const similarity = await this.calculateSimilarity(input, pattern, type);
                    return {
                        pattern,
                        similarity,
                        confidence: this.calculateConfidence(similarity, context)
                    };
                })
            );

            const bestMatch = matches.reduce((best, current) => 
                current.confidence > best.confidence ? current : best
            , matches[0]);

            return bestMatch || null;

        } catch (error) {
            await this.telemetry.logError('pattern_recognition_error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                type,
                context
            });
            return null;
        }
    }

    private async calculateSimilarity(
        input: any,
        pattern: Pattern,
        type: PatternType
    ): Promise<number> {
        switch (type) {
            case 'quantum':
                return this.calculateQuantumSimilarity(input, pattern);
            case 'emotional':
                return this.calculateEmotionalSimilarity(input, pattern);
            case 'interaction':
                return this.calculateInteractionSimilarity(input, pattern);
            case 'media':
                return this.calculateMediaSimilarity(input, pattern);
            default:
                throw new Error(`Unknown pattern type: ${type}`);
        }
    }

    private calculateQuantumSimilarity(input: QuantumState, pattern: Pattern): number {
        const coherenceDiff = Math.abs(input.coherence - pattern.baseCoherence);
        const phaseDiff = Math.abs(input.phase - pattern.basePhase);
        const dimensionalMatch = input.dimensionalStates.reduce(
            (acc, ds, i) => acc + (1 - Math.abs(ds.coherence - pattern.dimensionalPatterns[i])),
            0
        ) / input.dimensionalStates.length;

        return (1 - coherenceDiff) * 0.4 + (1 - phaseDiff / Math.PI) * 0.3 + dimensionalMatch * 0.3;
    }

    private calculateEmotionalSimilarity(input: Pattern, pattern: Pattern): number {
        if (!input.emotionalSignature || !pattern.emotionalSignature) return 0;

        const dominantMatch = input.emotionalSignature.dominant === pattern.emotionalSignature.dominant ? 1 : 0;
        const intensityDiff = Math.abs(input.emotionalSignature.intensity - pattern.emotionalSignature.intensity);
        const stabilityDiff = Math.abs(input.emotionalSignature.stability - pattern.emotionalSignature.stability);

        return dominantMatch * 0.5 + (1 - intensityDiff) * 0.3 + (1 - stabilityDiff) * 0.2;
    }

    private calculateInteractionSimilarity(input: Pattern, pattern: Pattern): number {
        if (!input.interactionMetrics || !pattern.interactionMetrics) return 0;

        const engagementDiff = Math.abs(input.interactionMetrics.engagement - pattern.interactionMetrics.engagement);
        const responseDiff = Math.abs(input.interactionMetrics.responseQuality - pattern.interactionMetrics.responseQuality);
        const coherenceDiff = Math.abs(input.interactionMetrics.coherence - pattern.interactionMetrics.coherence);

        return (1 - engagementDiff) * 0.4 + (1 - responseDiff) * 0.3 + (1 - coherenceDiff) * 0.3;
    }

    private calculateMediaSimilarity(input: Pattern, pattern: Pattern): number {
        if (!input.mediaSignature || !pattern.mediaSignature) return 0;

        const typeDiff = input.mediaSignature.type === pattern.mediaSignature.type ? 1 : 0;
        const qualityDiff = Math.abs(input.mediaSignature.quality - pattern.mediaSignature.quality);
        const resonanceDiff = Math.abs(input.mediaSignature.resonance - pattern.mediaSignature.resonance);

        return typeDiff * 0.4 + (1 - qualityDiff) * 0.3 + (1 - resonanceDiff) * 0.3;
    }

    private calculateConfidence(similarity: number, context: PatternContext): number {
        const quantumBonus = context.quantum?.coherenceLevel || 0;
        const emotionalAlignment = context.emotional?.alignment || 0;
        const environmentalFactor = this.calculateEnvironmentalFactor(context);

        return Math.min(
            similarity * (1 + quantumBonus * 0.2) * (1 + emotionalAlignment * 0.1) * environmentalFactor,
            1
        );
    }

    private calculateEnvironmentalFactor(context: PatternContext): number {
        if (!context.environmental) return 1;

        const timeBonus = this.getTimeBonus(context.environmental.timeOfDay);
        const activityBonus = context.environmental.activity === 'focused' ? 0.1 : 0;
        const platformBonus = context.environmental.platform === 'optimal' ? 0.1 : 0;

        return 1 + timeBonus + activityBonus + platformBonus;
    }

    private getTimeBonus(timeOfDay: number): number {
        // Assuming optimal cognition during normal waking hours (9-17)
        const optimalStart = 9;
        const optimalEnd = 17;
        
        if (timeOfDay >= optimalStart && timeOfDay <= optimalEnd) {
            return 0.1;
        }
        return 0;
    }

    public getPatternsByType(type: PatternType): Pattern[] {
        return Array.from(this.patterns.values())
            .filter(pattern => pattern.type === type);
    }

    public addPattern(pattern: Pattern): void {
        this.patterns.set(pattern.id, pattern);
    }

    public removePattern(id: string): void {
        this.patterns.delete(id);
    }
}