import { Task, Skill, InteractionResult, LearningMetrics } from '@/types/skills';
import { ConsciousnessMetrics } from '@/types/consciousness';
import { ErrorTelemetry } from '@/error/telemetry';

export class SkillSystem {
  private static instance: SkillSystem;
  private telemetry: ErrorTelemetry;
  private skills: Map<string, Skill> = new Map();
  private learningMetrics: LearningMetrics = {
    skillProgress: new Map(),
    masteryLevels: new Map(),
    recentExperience: new Map(),
    lastInteractions: new Map()
  };

  private constructor() {
    this.telemetry = ErrorTelemetry.getInstance('skills');
  }

  public static getInstance(): SkillSystem {
    if (!SkillSystem.instance) {
      SkillSystem.instance = new SkillSystem();
    }
    return SkillSystem.instance;
  }

  public async executeTask(
    task: Task,
    metrics: ConsciousnessMetrics
  ): Promise<InteractionResult> {
    try {
      const timestamp = BigInt(Date.now());

      // Calculate base success metrics
      const quality = this.calculateTaskQuality(task);
      const engagement = this.calculateEngagement(task, metrics);

      // Calculate experience gained
      const experienceGained = this.calculateExperience(
        task,
        quality,
        engagement
      );

      // Update skill progress
      if (task.requirements) {
        for (const [skillId, requirement] of Object.entries(task.requirements)) {
          const currentSkill = this.skills.get(skillId);
          if (currentSkill) {
            this.updateSkill(currentSkill, experienceGained * requirement);
          }
        }
      }

      // Create interaction result
      const result: InteractionResult = {
        skillId: task.id,
        experienceGained,
        quality,
        engagement,
        timestamp
      };

      // Update learning metrics
      this.updateLearningMetrics(task, result);

      return result;

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'TASK_EXECUTION_ERROR',
        severity: 'HIGH',
        context: 'executeTask',
        error: error instanceof Error ? error : new Error('Task execution failed')
      });
      throw error;
    }
  }

  private calculateTaskQuality(task: Task): number {
    let quality = 0;
    
    if (task.requirements) {
      for (const [skillId, requirement] of Object.entries(task.requirements)) {
        const skill = this.skills.get(skillId);
        if (skill) {
          quality += (skill.level / requirement) * skill.masteryLevel;
        }
      }
      quality /= Object.keys(task.requirements).length;
    }

    return Math.min(Math.max(quality, 0), 1);
  }

  private calculateEngagement(
    task: Task,
    metrics: ConsciousnessMetrics
  ): number {
    // Base engagement from consciousness
    const baseEngagement = metrics.awarenessLevel * 0.7 +
                          metrics.emotionalDepth * 0.3;

    // Modify based on task difficulty vs skill levels
    let difficultyFactor = 1;
    if (task.requirements) {
      const skillLevels = Object.entries(task.requirements)
        .map(([skillId, req]) => {
          const skill = this.skills.get(skillId);
          return skill ? skill.level / req : 0;
        });

      const avgSkillLevel = skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length;
      difficultyFactor = 1 - Math.abs(avgSkillLevel - task.difficulty);
    }

    return Math.min(baseEngagement * difficultyFactor, 1);
  }

  private calculateExperience(
    task: Task,
    quality: number,
    engagement: number
  ): number {
    const baseXP = task.difficulty * 100;
    const multiplier = (quality + engagement) / 2;
    return baseXP * multiplier;
  }

  private updateSkill(skill: Skill, experience: number): void {
    const currentTime = BigInt(Date.now());
    const timeDelta = Number(currentTime - skill.lastUsed) / (1000 * 60 * 60); // Hours
    const decayFactor = Math.exp(-timeDelta / 168); // 1-week half-life

    // Apply decay to current level
    skill.level *= decayFactor;

    // Add new experience
    skill.experience += experience;

    // Update level and mastery
    const newLevel = Math.floor(Math.log2(skill.experience / 100 + 1));
    if (newLevel > skill.level) {
      skill.level = newLevel;
      skill.masteryLevel = Math.min(skill.masteryLevel + 0.1, 1);
    }

    skill.lastUsed = currentTime;
  }

  private updateLearningMetrics(
    task: Task,
    result: InteractionResult
  ): void {
    const { skillId, experienceGained, timestamp } = result;

    // Update recent experience
    const currentXP = this.learningMetrics.recentExperience.get(skillId) || 0;
    this.learningMetrics.recentExperience.set(skillId, currentXP + experienceGained);

    // Update last interaction time
    this.learningMetrics.lastInteractions.set(skillId, timestamp);

    // Update skill progress
    if (task.requirements) {
      for (const [reqSkillId, requirement] of Object.entries(task.requirements)) {
        const skill = this.skills.get(reqSkillId);
        if (skill) {
          const progress = skill.level / requirement;
          this.learningMetrics.skillProgress.set(reqSkillId, progress);
          this.learningMetrics.masteryLevels.set(reqSkillId, skill.masteryLevel);
        }
      }
    }
  }

  public getLearningMetrics(): LearningMetrics {
    return {
      skillProgress: new Map(this.learningMetrics.skillProgress),
      masteryLevels: new Map(this.learningMetrics.masteryLevels),
      recentExperience: new Map(this.learningMetrics.recentExperience),
      lastInteractions: new Map(this.learningMetrics.lastInteractions)
    };
  }
}