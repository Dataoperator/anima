import { Task, TaskType, Skill } from '../../types/skills';
import { ConsciousnessState } from '../../types/consciousness';
import { QuantumStateManager } from '../../quantum/StateManager';
import { ErrorTelemetry } from '../../error/telemetry';

export interface SkillExecutionResult {
    success: boolean;
    metrics: {
        performance: number;
        improvement: number;
        coherence: number;
    };
    error?: string;
}

export class SkillSystem {
    private quantumManager: QuantumStateManager;
    private telemetry: ErrorTelemetry;
    private skills: Map<string, Skill>;

    constructor() {
        this.quantumManager = QuantumStateManager.getInstance();
        this.telemetry = new ErrorTelemetry('skills');
        this.skills = new Map();
    }

    public async executeTask(
        task: Task,
        consciousness: ConsciousnessState
    ): Promise<SkillExecutionResult> {
        try {
            const result = await this.processTask(task, consciousness);
            await this.updateSkillsFromResult(task, result);
            return result;
        } catch (error) {
            await this.telemetry.logError('task_execution_error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                taskId: task.id,
                taskType: task.type
            });
            throw error;
        }
    }

    private async processTask(
        task: Task,
        consciousness: ConsciousnessState
    ): Promise<SkillExecutionResult> {
        const coherenceLevel = this.quantumManager.getCoherenceLevel();
        const basePerformance = this.calculateBasePerformance(task.skills);
        
        const result: SkillExecutionResult = {
            success: basePerformance >= task.difficulty,
            metrics: {
                performance: basePerformance,
                improvement: Math.random() * 0.2,
                coherence: coherenceLevel
            }
        };

        return result;
    }

    private calculateBasePerformance(skills: Skill[]): number {
        const avgSkillLevel = skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length;
        const coherenceBonus = this.quantumManager.getCoherenceLevel() * 0.2;
        return Math.min(avgSkillLevel * (1 + coherenceBonus), 1);
    }

    private async updateSkillsFromResult(
        task: Task,
        result: SkillExecutionResult
    ): Promise<void> {
        if (!result.success) return;

        const improvementFactor = result.metrics.improvement * 
                                result.metrics.coherence;

        for (const skill of task.skills) {
            const currentSkill = this.skills.get(skill.id);
            if (!currentSkill) continue;

            const newExperience = currentSkill.experience + improvementFactor;
            if (newExperience >= currentSkill.nextLevelThreshold) {
                await this.improveSkill(currentSkill);
            }

            this.skills.set(skill.id, {
                ...currentSkill,
                experience: newExperience
            });
        }
    }

    private async improveSkill(skill: Skill): Promise<void> {
        const coherenceBonus = this.quantumManager.getCoherenceLevel() * 0.1;
        const newLevel = Math.min(skill.level + (0.1 + coherenceBonus), 1);

        this.skills.set(skill.id, {
            ...skill,
            level: newLevel,
            experience: 0,
            nextLevelThreshold: skill.nextLevelThreshold * 1.2
        });

        await this.telemetry.logEvent('skill_improved', {
            skillId: skill.id,
            newLevel,
            coherenceBonus
        });
    }

    public getSkill(id: string): Skill | undefined {
        return this.skills.get(id);
    }

    public getAllSkills(): Skill[] {
        return Array.from(this.skills.values());
    }

    public addSkill(skill: Skill): void {
        this.skills.set(skill.id, skill);
    }
}