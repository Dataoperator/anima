import { Skill } from './skill';

export enum TaskType {
  LEARNING = 'learning',
  CREATION = 'creation',
  INTERACTION = 'interaction',
  MEDIA = 'media'
}

export interface Task {
  id: string;
  type: TaskType;
  skills: Skill[];
  parameters: any;
  difficulty: number;
  requirements: {
    quantumCoherence?: number;
    emotionalAlignment?: number;
    skillLevel?: number;
  };
  validation: {
    criteria: Record<string, any>;
    minSuccess: number;
  };
  completionInfo?: {
    timestamp: number;
    success: boolean;
    score: number;
    feedback: string[];
  };
}

export interface TaskResult {
  success: boolean;
  output: any;
  feedback: string[];
  metrics: {
    accuracy: number;
    efficiency: number;
    creativity?: number;
    complexity?: number;
  };
}

export interface TaskValidationResult {
  isValid: boolean;
  feedback: string[];
  improvements: string[];
  score: number;
  impactMetrics: {
    coherenceImpact: number;
    emotionalImpact: number;
    skillGrowth: number;
  };
}