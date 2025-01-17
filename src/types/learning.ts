export interface LearningMetrics {
    comprehension: number;
    retention: number;
    application: number;
    engagement: number;
    adaptability: number;
}

export interface LearningParameters {
    minComprehension?: number;
    minRetention?: number;
    minApplication?: number;
    minEngagement?: number;
    maxDuration?: number;
}

export interface LearningState {
    currentPhase: string;
    progress: number;
    metrics: LearningMetrics;
    lastUpdate: number;
}

export interface PatternRecognitionResult {
    recognized: boolean;
    confidence: number;
    patterns: string[];
    metrics: {
        accuracy: number;
        speed: number;
        complexity: number;
    };
}