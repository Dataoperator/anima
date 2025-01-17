import { Task, TaskType, Skill } from '../../types/skills';
import { MediaValidation } from '../../types/media';
import { InteractionResult } from '../../types/interaction';
import { LearningMetrics } from '../../types/learning';
import { CreationOutput } from '../../types/creation';
import { QuantumStateManager } from '../../quantum/StateManager';

interface ValidationParameters {
    minDuration?: number;
    minQuality?: number;
    minEngagement?: number;
    minComprehension?: number;
    minRetention?: number;
    minApplication?: number;
    minPattern?: number;
    maxTime?: number;
    minOriginality?: number;
    minComplexity?: number;
}

export class CurriculumGenerator {
    private quantumStateManager: QuantumStateManager;

    constructor() {
        this.quantumStateManager = QuantumStateManager.getInstance();
    }

    public generateTask(type: TaskType, skills: Skill[]): Task {
        const coherenceBonus = this.quantumStateManager.getCoherenceLevel() * 0.2;
        
        let difficulty = this.calculateBaseDifficulty(skills);
        difficulty = Math.min(difficulty * (1 + coherenceBonus), 1);

        return {
            id: crypto.randomUUID(),
            type,
            skills,
            difficulty,
            status: 'pending',
            completionCriteria: this.generateCompletionCriteria(type, difficulty)
        };
    }

    private calculateBaseDifficulty(skills: Skill[]): number {
        const avgSkillLevel = skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length;
        return Math.min(Math.max(avgSkillLevel * 1.2, 0), 1);
    }

    private generateCompletionCriteria(type: TaskType, difficulty: number): ValidationParameters {
        const baseCriteria = {
            minQuality: 0.6 + (difficulty * 0.2),
            minEngagement: 0.5 + (difficulty * 0.3),
            minComprehension: 0.7 + (difficulty * 0.2),
            minRetention: 0.6 + (difficulty * 0.2),
            minApplication: 0.5 + (difficulty * 0.3),
            minPattern: 0.7 + (difficulty * 0.2),
            maxTime: 5000 - (difficulty * 1000),
            minOriginality: 0.6 + (difficulty * 0.3),
            minComplexity: 0.5 + (difficulty * 0.4)
        };

        return baseCriteria;
    }

    public validateTaskResult(
        task: Task,
        result: MediaValidation | InteractionResult | LearningMetrics | CreationOutput
    ): boolean {
        const parameters = task.completionCriteria;
        const coherenceBonus = this.quantumStateManager.getCoherenceLevel() > 0.8 ? 0.1 : 0;

        switch (task.type) {
            case TaskType.Learning:
                return this.validateLearningResult(result as LearningMetrics, parameters, coherenceBonus);
            case TaskType.Creation:
                return this.validateCreationResult(result as CreationOutput, parameters, coherenceBonus);
            case TaskType.Analysis:
                return this.validateMediaResult(result as MediaValidation, parameters, coherenceBonus);
            case TaskType.Integration:
                return this.validateInteractionResult(result as InteractionResult, parameters, coherenceBonus);
            default:
                return false;
        }
    }

    private validateMediaResult(
        validation: MediaValidation,
        parameters: ValidationParameters,
        coherenceBonus: number
    ): boolean {
        const coherenceLevel = this.quantumStateManager.getCoherenceLevel();
        const adjustedThreshold = (threshold: number) => threshold - (coherenceLevel * 0.1) - coherenceBonus;

        const qualityResult = validation.quality >= adjustedThreshold(parameters.minQuality || 0.7);
        const coherenceResult = validation.coherence >= adjustedThreshold(parameters.minQuality || 0.6);
        const stabilityResult = validation.stability >= adjustedThreshold(parameters.minQuality || 0.5);

        return qualityResult && coherenceResult && stabilityResult;
    }

    private validateInteractionResult(
        interaction: InteractionResult,
        parameters: ValidationParameters,
        coherenceBonus: number
    ): boolean {
        const coherenceLevel = this.quantumStateManager.getCoherenceLevel();
        const adjustedThreshold = (threshold: number) => threshold - (coherenceLevel * 0.1) - coherenceBonus;

        return interaction.quality >= adjustedThreshold(parameters.minQuality || 0.7) &&
               interaction.engagement >= adjustedThreshold(parameters.minEngagement || 0.6) &&
               interaction.resonance >= adjustedThreshold(parameters.minPattern || 0.5);
    }

    private validateLearningResult(
        metrics: LearningMetrics,
        parameters: ValidationParameters,
        coherenceBonus: number
    ): boolean {
        const coherenceLevel = this.quantumStateManager.getCoherenceLevel();
        const adjustedThreshold = (threshold: number) => threshold - (coherenceLevel * 0.1) - coherenceBonus;

        return metrics.comprehension >= adjustedThreshold(parameters.minComprehension || 0.7) &&
               metrics.retention >= adjustedThreshold(parameters.minRetention || 0.6) &&
               metrics.application >= adjustedThreshold(parameters.minApplication || 0.5);
    }

    private validateCreationResult(
        output: CreationOutput,
        parameters: ValidationParameters,
        coherenceBonus: number
    ): boolean {
        const coherenceLevel = this.quantumStateManager.getCoherenceLevel();
        const adjustedThreshold = (threshold: number) => threshold - (coherenceLevel * 0.1) - coherenceBonus;

        return output.quality >= adjustedThreshold(parameters.minQuality || 0.7) &&
               output.originality >= adjustedThreshold(parameters.minOriginality || 0.6) &&
               output.complexity >= adjustedThreshold(parameters.minComplexity || 0.5);
    }

    public getImprovementSuggestions(task: Task, result: any): string[] {
        const improvements: string[] = [];
        const coherenceLevel = this.quantumStateManager.getCoherenceLevel();

        // Add skill-based suggestions
        const skillGaps = task.skills.filter(s => s.level < 0.7);
        if (skillGaps.length > 0) {
            improvements.push(`Focus on improving: ${skillGaps.map(s => s.name).join(', ')}`);
        }

        // Add coherence-based suggestions
        if (coherenceLevel < 0.7) {
            improvements.push('Work on improving quantum coherence for better performance');
        }

        return improvements;
    }
}