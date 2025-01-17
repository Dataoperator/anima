export interface InteractionResult {
    success: boolean;
    coherence: number;
    resonance: number;
    patterns: string[];
    metrics: {
        quality: number;
        engagement: number;
        depth: number;
        alignment: number;
    };
}

export interface InteractionMetrics {
    quality: number;
    engagement: number;
    resonance: number;
    coherence: number;
    patterns: string[];
}