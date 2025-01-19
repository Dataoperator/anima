import { EmotionType, EmotionalSignature, EmotionalState, Emotion } from '@/types/emotional';
import { ErrorTelemetry } from '@/error/telemetry';

export class EmotionalProcessor {
  private static instance: EmotionalProcessor;
  private telemetry: ErrorTelemetry;
  private currentState: EmotionalState;
  private emotionalMemory: Emotion[] = [];

  private constructor() {
    this.telemetry = ErrorTelemetry.getInstance('emotional');
    this.currentState = {
      dominant: {
        type: EmotionType.NEUTRAL,
        intensity: 0.5,
        timestamp: BigInt(Date.now())
      },
      lastUpdate: BigInt(Date.now()),
      history: []
    };
  }

  public static getInstance(): EmotionalProcessor {
    if (!EmotionalProcessor.instance) {
      EmotionalProcessor.instance = new EmotionalProcessor();
    }
    return EmotionalProcessor.instance;
  }

  public async processEmotionalPattern(
    pattern: EmotionalSignature
  ): Promise<EmotionalState> {
    try {
      // Convert pattern to emotion
      const newEmotion: Emotion = {
        type: pattern.type,
        intensity: pattern.intensity,
        timestamp: BigInt(Date.now())
      };

      // Update emotional memory
      this.emotionalMemory.push(newEmotion);
      if (this.emotionalMemory.length > 100) {
        this.emotionalMemory = this.emotionalMemory.slice(-100);
      }

      // Update current state
      this.updateDominantEmotion(newEmotion);

      return this.currentState;

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'PATTERN_PROCESSING_ERROR',
        severity: 'HIGH',
        context: 'processEmotionalPattern',
        error: error instanceof Error ? error : new Error('Pattern processing failed')
      });
      throw error;
    }
  }

  private updateDominantEmotion(newEmotion: Emotion): void {
    const currentDominant = this.currentState.dominant;

    // If new emotion is stronger or current dominant has decayed significantly
    if (
      newEmotion.intensity > currentDominant.intensity * 1.1 ||
      this.hasEmotionDecayed(currentDominant)
    ) {
      // Update state with new dominant emotion
      this.currentState = {
        dominant: newEmotion,
        secondary: currentDominant.intensity > 0.3 ? currentDominant : undefined,
        lastUpdate: BigInt(Date.now()),
        history: [...this.currentState.history, newEmotion]
      };
    }
  }

  private hasEmotionDecayed(emotion: Emotion): boolean {
    const now = BigInt(Date.now());
    const age = Number(now - emotion.timestamp) / 1000; // Convert to seconds
    const decayFactor = Math.exp(-age / 300); // 5-minute half-life
    return emotion.intensity * decayFactor < 0.3;
  }

  public getCurrentEmotionalState(): EmotionalState {
    return { ...this.currentState };
  }

  public getEmotionalTrends(): Map<EmotionType, number> {
    const trends = new Map<EmotionType, number>();
    const recentMemory = this.emotionalMemory.slice(-10);

    // Calculate frequency of each emotion type
    recentMemory.forEach(emotion => {
      const current = trends.get(emotion.type) || 0;
      trends.set(emotion.type, current + 1);
    });

    // Normalize to percentages
    for (const [type, count] of trends.entries()) {
      trends.set(type, count / recentMemory.length);
    }

    return trends;
  }
}