export enum TaskType {
  COGNITIVE = 'COGNITIVE',
  PERCEPTUAL = 'PERCEPTUAL',
  EMOTIONAL = 'EMOTIONAL',
  CREATIVE = 'CREATIVE',
  SOCIAL = 'SOCIAL'
}

export interface Task {
  id: string;
  type: TaskType;
  difficulty: number;
  description: string;
  requirements?: Record<string, number>;
  metadata?: Record<string, unknown>;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  experience: number;
  masteryLevel: number;
  lastUsed: bigint;
  relatedTasks: string[];
}

export interface InteractionResult {
  skillId: string;
  experienceGained: number;
  quality: number;
  engagement: number;
  timestamp: bigint;
}

export interface ValidationParameters {
  minQuality: number;
  minEngagement: number;
  requiredSkills: string[];
  minMasteryLevel?: number;
}

export interface LearningMetrics {
  skillProgress: Map<string, number>;
  masteryLevels: Map<string, number>;
  recentExperience: Map<string, number>;
  lastInteractions: Map<string, bigint>;
}