export interface CreationOutput {
    id: string;
    type: string;
    content: any;
    quality: number;
    originality: number;
    complexity: number;
    timestamp: number;
    metrics: {
        coherence: number;
        resonance: number;
        dimensionality: number;
    };
    parameters?: {
        minQuality?: number;
        minOriginality?: number;
        minComplexity?: number;
        maxDuration?: number;
    };
}

export interface CreationState {
    phase: string;
    progress: number;
    quality: number;
    metrics: {
        coherence: number;
        resonance: number;
        dimensionality: number;
    };
}

export interface CreationMetrics {
    quality: number;
    originality: number;
    complexity: number;
    coherence: number;
}