export type PatternType = 'quantum' | 'emotional' | 'interaction' | 'media' | 'behavioral';

export type Emotion = 'joy' | 'wonder' | 'curiosity' | 'calm' | 'focus' | 'uncertainty';

export interface EmotionalSignature {
    dominant: Emotion;
    intensity: number;
    stability: number;
    secondary?: Emotion[];
}

export interface InteractionMetrics {
    engagement: number;
    responseQuality: number;
    coherence: number;
    duration?: number;
}

export interface MediaSignature {
    type: string;
    quality: number;
    resonance: number;
    duration?: number;
}

export interface Pattern {
    id: string;
    type: PatternType;
    baseCoherence: number;
    basePhase: number;
    dimensionalPatterns: number[];
    timestamp: number;
    strength: number;
    emotionalSignature?: EmotionalSignature;
    interactionMetrics?: InteractionMetrics;
    mediaSignature?: MediaSignature;
}

export interface PatternContext {
    quantum?: {
        coherenceLevel: number;
        entanglementStrength?: number;
    };
    emotional?: {
        alignment: number;
        dominantEmotion?: Emotion;
    };
    environmental?: {
        timeOfDay: number;  // 0-24
        activity: string;   // 'focused', 'relaxed', etc.
        platform: string;   // 'optimal', 'suboptimal'
    };
}