import { QuantumState } from '@/types/quantum';
import { EmotionalState } from '@/types/emotional';
import { Skill, SkillCategory, SkillExecutionResult } from '@/types/skill';
import { v4 as uuidv4 } from 'uuid';

export class SkillSystem {
    private skills: Map<string, Skill>;
    private skillDependencies: Map<string, Set<string>>;

    constructor() {
        this.skills = new Map();
        this.skillDependencies = new Map();
    }

    private async executeLearningSkill(
        skill: Skill,
        context: any
    ): Promise<SkillExecutionResult> {
        const { patternType, input } = context;
        let success = false;
        let output = null;

        try {
            switch (patternType) {
                case 'user_preference':
                    success = true;
                    output = {
                        pattern: `preference_${input.category}`,
                        confidence: 0.8
                    };
                    break;
                    
                case 'content_pattern':
                    success = true;
                    output = {
                        pattern: `content_pattern_${input.type}`,
                        examples: input.examples
                    };
                    break;

                case 'interaction_flow':
                    success = true;
                    output = {
                        pattern: `flow_${input.context}`,
                        steps: input.steps
                    };
                    break;
            }

            return {
                success,
                output,
                quantumImpact: success ? 0.2 : -0.1,
                emotionalImpact: success ? 0.15 : -0.05,
                learningOutcome: success ? {
                    newPatterns: [`${patternType}_pattern_learned`],
                    improvements: [`${patternType}_recognition`]
                } : undefined
            };
        } catch (error) {
            return {
                success: false,
                output: null,
                quantumImpact: -0.1,
                emotionalImpact: -0.1
            };
        }
    }

    private async executeCreationSkill(
        skill: Skill,
        context: any
    ): Promise<SkillExecutionResult> {
        const { creationType, parameters } = context;
        let success = false;
        let output = null;

        try {
            switch (creationType) {
                case 'playlist':
                    success = true;
                    output = {
                        playlistId: uuidv4(),
                        items: parameters.items,
                        theme: parameters.theme
                    };
                    break;

                case 'media_mix':
                    success = true;
                    output = {
                        mixId: uuidv4(),
                        segments: parameters.segments,
                        transitions: parameters.transitions
                    };
                    break;

                case 'interactive_sequence':
                    success = true;
                    output = {
                        sequenceId: uuidv4(),
                        steps: parameters.steps,
                        branching: parameters.branches
                    };
                    break;
            }

            return {
                success,
                output,
                quantumImpact: success ? 0.15 : -0.05,
                emotionalImpact: success ? 0.2 : -0.1,
                learningOutcome: success ? {
                    newPatterns: [`${creationType}_creation_pattern`],
                    improvements: [`${creationType}_quality`]
                } : undefined
            };
        } catch (error) {
            return {
                success: false,
                output: null,
                quantumImpact: -0.15,
                emotionalImpact: -0.2
            };
        }
    }

    private canSkillLevelUp(skill: Skill): boolean {
        const totalAttempts = skill.successCount + skill.failureCount;
        const successRate = skill.successCount / totalAttempts;
        return totalAttempts >= 10 && successRate >= 0.8;
    }

    private async levelUpSkill(skill: Skill): Promise<void> {
        skill.level++;
        this.generateRelatedSkills(skill);
    }

    private async generateRelatedSkills(baseSkill: Skill): Promise<void> {
        const newSkillData = {
            name: `Advanced ${baseSkill.name}`,
            description: `Enhanced version of ${baseSkill.name}`,
            category: baseSkill.category,
            level: baseSkill.level + 1,
            requirements: [baseSkill.id]
        };

        const newSkill: Skill = {
            id: uuidv4(),
            ...newSkillData,
            learned: new Date(),
            lastUsed: new Date(),
            successCount: 0,
            failureCount: 0,
            context: {
                quantum: {},
                emotional: {}
            }
        };

        this.skills.set(newSkill.id, newSkill);
        this.addDependency(newSkill.id, baseSkill.id);
    }

    private addDependency(skillId: string, dependsOn: string): void {
        if (!this.skillDependencies.has(skillId)) {
            this.skillDependencies.set(skillId, new Set());
        }
        this.skillDependencies.get(skillId)?.add(dependsOn);
    }

    public getAvailableSkills(
        quantum: QuantumState,
        emotional: EmotionalState
    ): Skill[] {
        return Array.from(this.skills.values()).filter(skill => {
            const hasRequirements = skill.requirements.every(reqId => 
                this.skills.has(reqId)
            );

            const hasQuantumReq = quantum.coherenceLevel >= 0.5;

            return hasRequirements && hasQuantumReq;
        });
    }

    public getSkillById(skillId: string): Skill | undefined {
        return this.skills.get(skillId);
    }

    public getSkillsByCategory(category: SkillCategory): Skill[] {
        return Array.from(this.skills.values()).filter(
            skill => skill.category === category
        );
    }

    public getSkillProgression(): Map<string, string[]> {
        const progression = new Map<string, string[]>();
        
        for (const [skillId, dependencies] of this.skillDependencies) {
            progression.set(skillId, Array.from(dependencies));
        }
        
        return progression;
    }

    public async suggestNextSkill(
        currentState: {
            quantum: QuantumState;
            emotional: EmotionalState;
            recentActivities: string[];
        }
    ): Promise<Skill | undefined> {
        const availableSkills = this.getAvailableSkills(
            currentState.quantum,
            currentState.emotional
        );

        const unusedSkills = availableSkills.filter(skill => 
            !currentState.recentActivities.includes(skill.id)
        );

        return unusedSkills.sort((a, b) => {
            const aScore = this.calculateSkillRelevance(a, currentState);
            const bScore = this.calculateSkillRelevance(b, currentState);
            return bScore - aScore;
        })[0];
    }

    private calculateSkillRelevance(
        skill: Skill,
        state: {
            quantum: QuantumState;
            emotional: EmotionalState;
            recentActivities: string[];
        }
    ): number {
        let score = 0;

        const totalAttempts = skill.successCount + skill.failureCount;
        if (totalAttempts > 0) {
            score += (skill.successCount / totalAttempts) * 0.4;
        }

        if (skill.context.quantum.coherenceLevel) {
            const coherenceDiff = Math.abs(
                (skill.context.quantum.coherenceLevel || 0) - 
                (state.quantum.coherenceLevel || 0)
            );
            score += (1 - coherenceDiff) * 0.3;
        }

        const hoursSinceUse = (Date.now() - skill.lastUsed.getTime()) / (1000 * 60 * 60);
        score += Math.min(hoursSinceUse / 24, 1) * 0.3;

        return score;
    }
}