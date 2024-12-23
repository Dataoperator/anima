import { Principal } from '@dfinity/principal';

export interface AnimaMetrics {
    total_memories: bigint;
    avg_emotional_impact: number;
    avg_importance_score: number;
    personality_development: DevelopmentMetrics;
    interaction_frequency: number;
    autonomous_ratio: number;
}

export interface DevelopmentMetrics {
    growth_rate: number;
    trait_stability: number;
    learning_curve: number;
    emotional_maturity: number;
}

export enum DevelopmentalStage {
    Initial = 'Initial',
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
    Expert = 'Expert',
}

export enum EventType {
    Initial = 'Initial',
    UserInteraction = 'UserInteraction',
    AutonomousThought = 'AutonomousThought',
    EmotionalResponse = 'EmotionalResponse',
    LearningMoment = 'LearningMoment',
    RelationshipDevelopment = 'RelationshipDevelopment',
}

export interface Memory {
    timestamp: bigint;
    event_type: EventType;
    description: string;
    emotional_impact: number;
    importance_score: number;
    keywords: string[];
}

export interface NFTPersonality {
    traits: [string, number][];
    memories: Memory[];
    creation_time: bigint;
    interaction_count: bigint;
    growth_level: number;
    developmental_stage: DevelopmentalStage;
    hash: string | null;
}

export interface Anima {
    owner: Principal;
    name: string;
    personality: NFTPersonality;
    creation_time: bigint;
    last_interaction: bigint;
    autonomous_enabled: boolean;
}

export interface InteractionResult {
    response: string;
    personality_updates: [string, number][];
    memory: Memory;
    is_autonomous: boolean;
}

export interface InitializationResult {
    anima_id: Principal;
    name: string;
    creation_time: bigint;
}

export interface UserState {
    NotInitialized?: null;
    Initialized?: {
        anima_id: Principal;
        name: string;
    };
}

export type AnimaResult<T> = {
    Ok: T;
} | {
    Err: AnimaError;
};

export type AnimaError = {
    NotFound: null;
} | {
    NotAuthorized: null;
} | {
    Configuration: string;
} | {
    External: string;
};