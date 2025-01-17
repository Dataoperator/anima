import { QuantumState } from './quantum';
import { EmotionalState } from './emotional';

export interface Skill {
    id: string;
    name: string;
    description: string;
    category: SkillCategory;
    level: number;
    requirements: string[];
    learned: Date;
    lastUsed: Date;
    successCount: number;
    failureCount: number;
    context: {
        quantum: Partial<QuantumState>;
        emotional: Partial<EmotionalState>;
    };
}

export enum SkillCategory {
    LEARNING = 'learning',
    CREATION = 'creation',
    INTERACTION = 'interaction',
    ANALYSIS = 'analysis',
    SYNTHESIS = 'synthesis'
}

export interface SkillExecutionResult {
    success: boolean;
    output: any;
    quantumImpact: number;
    emotionalImpact: number;
    learningOutcome?: {
        newPatterns: string[];
        improvements: string[];
    };
}