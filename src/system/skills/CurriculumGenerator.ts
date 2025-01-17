import { Task, TaskType, Skill, TaskValidation, ValidationResult } from '../../types/skills';
import { MediaValidation } from '../../types/media';
import { InteractionResult } from '../../types/interaction';
import { LearningMetrics } from '../../types/learning';
import { CreationOutput } from '../../types/creation';
import { QuantumStateManager } from '../quantum/StateManager';

export class CurriculumGenerator {
    private tasks: Task[] = [];
    private readonly quantumStateManager: QuantumStateManager;
    private readonly complexityThreshold = 0.7;
    private readonly learningThreshold = 0.6;

    constructor(quantumStateManager: QuantumStateManager) {
        this.quantumStateManager = quantumStateManager;
    }

    private calculateTaskComplexity(
        skills: Skill[],
        parameters: any
    ): number {
        const baseComplexity = skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length;
        const parameterComplexity = Object.keys(parameters).length * 0.1;
        const coherenceBonus = this.quantumStateManager.getCoherenceLevel() * 0.2;

        return Math.min((baseComplexity + parameterComplexity + coherenceBonus), 1.0);
    }

    public async generateTask(
        type: TaskType,
        skills: Skill[],
        parameters: any = {}
    ): Promise<Task> {
        const complexity = this.calculateTaskComplexity(skills, parameters);
        const validationFunction = this.createValidationFunction(type, parameters);

        const task: Task = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            skills,
            parameters,
            complexity,
            createdAt: Date.now(),
            status: 'pending',
            validationFunction
        };

        this.tasks.push(task);
        return task;
    }

    private createValidationFunction(
        taskType: string,
        parameters: any
    ): (result: any) => boolean {
        switch (taskType) {
            case 'media':
                return (result: any) => this.validateMediaTask(result, parameters);
            case 'interaction':
                return (result: any) => this.validateInteractionTask(result, parameters);
            case 'learning':
                return (result: any) => this.validateLearningTask(result, parameters);
            case 'creation':
                return (result: any) => this.validateCreationTask(result, parameters);
            default:
                return () => false;
        }
    }

    private validateMediaTask(result: any, parameters: any): boolean {
        const validation: MediaValidation = result;
        
        const durationValid = validation.duration >= (parameters.minDuration || 0);
        const qualityValid = validation.quality >= (parameters.minQuality || 0.5);
        const engagementValid = validation.engagement >= (parameters.minEngagement || 0.6);
        
        const coherenceLevel = this.quantumStateManager.getCoherenceLevel();
        const coherenceBonus = coherenceLevel > 0.8 ? 0.1 : 0;

        const overallScore = (
            (durationValid ? 1 : 0) +
            (qualityValid ? 1 : 0) +
            (engagementValid ? 1 : 0)
        ) / 3 + coherenceBonus;

        return overallScore >= 0.7;
    }

    private validateInteractionTask(result: any, parameters: any): boolean {
        const interaction: InteractionResult = result;
        
        const responseValid = interaction.responseQuality >= (parameters.minQuality || 0.6);
        const timeValid = interaction.responseTime <= (parameters.maxTime || 5000);
        const patternValid = interaction.patternMatch >= (parameters.minPattern || 0.7);
        
        const coherenceBonus = this.quantumStateManager.getCoherenceLevel() > 0.8 ? 0.1 : 0;

        const score = (
            (responseValid ? 1 : 0) +
            (timeValid ? 1 : 0) +
            (patternValid ? 1 : 0)
        ) / 3 + coherenceBonus;

        return score >= 0.7;
    }

    private validateLearningTask(result: any, parameters: any): boolean {
        const metrics: LearningMetrics = result;
        
        const comprehensionValid = metrics.comprehension >= (parameters.minComprehension || 0.7);
        const retentionValid = metrics.retention >= (parameters.minRetention || 0.6);
        const applicationValid = metrics.application >= (parameters.minApplication || 0.5);
        
        const coherenceLevel = this.quantumStateManager.getCoherenceLevel();
        const coherenceBonus = coherenceLevel > 0.8 ? 0.1 : 0;

        const overallScore = (
            metrics.comprehension * 0.4 +
            metrics.retention * 0.3 +
            metrics.application * 0.3
        ) + coherenceBonus;

        return overallScore >= this.learningThreshold;
    }

    private validateCreationTask(result: any, parameters: any): boolean {
        const output: CreationOutput = result;
        
        const qualityValid = output.quality >= (parameters.minQuality || 0.7);
        const originalityValid = output.originality >= (parameters.minOriginality || 0.6);
        const complexityValid = output.complexity >= (parameters.minComplexity || 0.5);
        
        const coherenceBonus = this.quantumStateManager.getCoherenceLevel() > 0.8 ? 0.1 : 0;

        const overallScore = (
            output.quality * 0.4 +
            output.originality * 0.3 +
            output.complexity * 0.3
        ) + coherenceBonus;

        return overallScore >= this.complexityThreshold;
    }

    public getTaskHistory(): Task[] {
        return [...this.tasks];
    }

    public analyzeTaskSuccess(task: Task, result: any): {
        success: boolean;
        feedback: string[];
        improvements: string[];
    } {
        const validationResult = task.validationFunction(result);
        const feedback: string[] = [];
        const improvements: string[] = [];

        const coherenceLevel = this.quantumStateManager.getCoherenceLevel();
        
        if (validationResult) {
            feedback.push('Task completed successfully');
            if (coherenceLevel > 0.8) {
                feedback.push('High quantum coherence enhanced performance');
            }
        } else {
            feedback.push('Task completion needs improvement');
            if (coherenceLevel < 0.6) {
                improvements.push('Increase quantum coherence for better results');
            }
            improvements.push('Review task requirements and try again');
        }

        const skillGaps = task.skills.filter(skill => skill.level < 0.7);
        if (skillGaps.length > 0) {
            improvements.push(`Focus on improving: ${skillGaps.map(s => s.name).join(', ')}`);
        }

        return {
            success: validationResult,
            feedback,
            improvements
        };
    }
}

export default CurriculumGenerator;