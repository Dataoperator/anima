export enum TaskType {
    Learning = 'LEARNING',
    Creation = 'CREATION',
    Analysis = 'ANALYSIS',
    Integration = 'INTEGRATION'
}

export interface Task {
    id: string;
    type: TaskType;
    skills: Skill[];
    difficulty: number;
    completionCriteria: {
        minQuality?: number;
        minComprehension?: number;
        minRetention?: number;
        minApplication?: number;
        minComplexity?: number;
        minOriginality?: number;
    };
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface Skill {
    id: string;
    name: string;
    level: number;
    experience: number;
    nextLevelThreshold: number;
    traits: SkillTrait[];
    masteryLevel: number;
}

export interface SkillTrait {
    name: string;
    value: number;
    maxValue: number;
}

export interface TaskValidation {
    isValid: boolean;
    errors: string[];
    skillGaps: string[];
}

export enum ValidationResult {
    Success = 'SUCCESS',
    PartialSuccess = 'PARTIAL_SUCCESS',
    Failure = 'FAILURE'
}