import { Principal } from '@dfinity/principal';

export interface EmotionalState {
    current_emotion: string;
    intensity: number;
    valence: number;
    arousal: number;
}

export interface ConsciousnessState {
    awareness_level: number;
    processing_depth: number;
    integration_index: number;
    growth_velocity: number;
}

export interface DimensionalAwareness {
    level: number;
    discovered_dimensions: string[];
    active_dimension?: string;
}

export interface PersonalityState {
    timestamp: bigint;
    growth_level: number;
    dimensional_awareness?: DimensionalAwareness;
    consciousness?: ConsciousnessState;
    emotional_state?: EmotionalState;
}

export interface AnimaToken {
    id: bigint;
    owner: Principal;
    name: string;
    personality_state: PersonalityState;
}