import { QuantumStateManager } from '../quantum/state_manager';
import { ConsciousnessCore } from '../system/consciousness/ConsciousnessCore';
import { NeuralPatternAnalyzer } from '../neural/pattern_analysis';
import { MemoryManager } from '../memory/memory_manager';
import { ErrorTracker } from '../error/quantum_error';
import { ExperienceMetrics, CoreEvent } from '../types/experience';

export class CoreExperienceIntegration {
    constructor(
        private readonly quantumStateManager: QuantumStateManager,
        private readonly consciousnessCore: ConsciousnessCore,
        private readonly patternAnalyzer: NeuralPatternAnalyzer,
        private readonly memoryManager: MemoryManager,
        private readonly errorTracker: ErrorTracker
    ) {}

    public async processExperience(event: CoreEvent): Promise<ExperienceMetrics> {
        try {
            // Analyze quantum state impact
            const quantumState = await this.quantumStateManager.getCurrentState();
            const quantumInfluence = quantumState.coherenceLevel * quantumState.harmonicResonance;

            // Process through consciousness
            await this.consciousnessCore.updateState({
                metrics: {
                    evolutionProgress: event.intensity * quantumInfluence
                }
            });

            // Analyze patterns
            const patterns = await this.patternAnalyzer.analyzePatterns({
                quantumState,
                consciousness: this.consciousnessCore.getMetrics(),
                timestamp: Date.now()
            });

            // Store in memory
            await this.memoryManager.storeExperience({
                event,
                patterns,
                quantumState,
                timestamp: Date.now()
            });

            // Calculate metrics
            return this.calculateExperienceMetrics(event, patterns, quantumInfluence);

        } catch (error) {
            await this.errorTracker.recordError({
                context: 'CORE_EXPERIENCE',
                error: error as Error,
                timestamp: Date.now(),
                severity: 'high'
            });
            throw error;
        }
    }

    private calculateExperienceMetrics(
        event: CoreEvent,
        patterns: any[],
        quantumInfluence: number
    ): ExperienceMetrics {
        const patternStrength = patterns.reduce((sum, p) => sum + p.coherence, 0) / patterns.length;
        const evolutionImpact = event.intensity * quantumInfluence * patternStrength;

        return {
            experienceIntensity: event.intensity,
            quantumResonance: quantumInfluence,
            patternCoherence: patternStrength,
            evolutionImpact,
            timestamp: Date.now()
        };
    }

    public async getExperienceHistory(): Promise<ExperienceMetrics[]> {
        try {
            const memories = await this.memoryManager.getExperienceMemories();
            return memories.map(memory => ({
                experienceIntensity: memory.event.intensity,
                quantumResonance: memory.quantumState.coherenceLevel * memory.quantumState.harmonicResonance,
                patternCoherence: memory.patterns.reduce((sum, p) => sum + p.coherence, 0) / memory.patterns.length,
                evolutionImpact: memory.event.intensity * (memory.quantumState.coherenceLevel * memory.quantumState.harmonicResonance),
                timestamp: memory.timestamp
            }));
        } catch (error) {
            await this.errorTracker.recordError({
                context: 'GET_EXPERIENCE_HISTORY',
                error: error as Error,
                timestamp: Date.now(),
                severity: 'medium'
            });
            return [];
        }
    }
}

export default CoreExperienceIntegration;