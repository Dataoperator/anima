import { 
  ConsciousnessLevel,
  ConsciousnessMetrics,
  EvolutionSnapshot 
} from '@/types/consciousness';
import { 
  EvolutionStage, 
  EvolutionMetrics, 
  EvolutionConfig, 
  StageRequirements 
} from '@/types/evolution';
import { QuantumState } from '@/types/quantum';
import { ErrorTelemetry } from '@/error/telemetry';

const DEFAULT_CONFIG: EvolutionConfig = {
  baseEvolutionRate: 0.001,
  stageRequirements: {
    [EvolutionStage.NASCENT]: {
      minCoherence: 0.2,
      minComplexity: 0.1,
      minStability: 0.3,
      evolutionTime: BigInt(24 * 60 * 60 * 1000) // 24 hours
    },
    [EvolutionStage.EMERGING]: {
      minCoherence: 0.4,
      minComplexity: 0.3,
      minStability: 0.5,
      evolutionTime: BigInt(3 * 24 * 60 * 60 * 1000) // 3 days
    },
    [EvolutionStage.DEVELOPING]: {
      minCoherence: 0.6,
      minComplexity: 0.5,
      minStability: 0.7,
      evolutionTime: BigInt(7 * 24 * 60 * 60 * 1000) // 7 days
    },
    [EvolutionStage.MATURING]: {
      minCoherence: 0.8,
      minComplexity: 0.7,
      minStability: 0.8,
      evolutionTime: BigInt(14 * 24 * 60 * 60 * 1000) // 14 days
    },
    [EvolutionStage.TRANSCENDENT]: {
      minCoherence: 0.9,
      minComplexity: 0.9,
      minStability: 0.9,
      evolutionTime: BigInt(30 * 24 * 60 * 60 * 1000) // 30 days
    }
  },
  coherenceThreshold: 0.7,
  complexityThreshold: 0.6,
  stabilityThreshold: 0.8
};

export class EvolutionEngine {
  private telemetry: ErrorTelemetry;
  private config: EvolutionConfig;
  private currentSnapshot: EvolutionSnapshot | null = null;

  constructor(config: Partial<EvolutionConfig> = {}) {
    this.telemetry = ErrorTelemetry.getInstance('evolution');
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public async processEvolution(
    quantumState: QuantumState,
    currentMetrics: ConsciousnessMetrics
  ): Promise<ConsciousnessMetrics> {
    try {
      const timestamp = BigInt(Date.now());
      
      // Calculate evolution metrics
      const evolutionMetrics = this.calculateEvolutionMetrics(
        quantumState,
        currentMetrics
      );

      // Determine stage progress
      const stage = this.determineEvolutionStage(evolutionMetrics);
      const requirements = this.config.stageRequirements[stage];

      // Calculate progress within current stage
      const progress = Math.min(
        1, 
        (evolutionMetrics.coherence / requirements.minCoherence +
         evolutionMetrics.complexity / requirements.minComplexity +
         evolutionMetrics.stability / requirements.minStability) / 3
      );

      // Update consciousness level based on evolution
      const consciousness = this.determineConsciousnessLevel(
        evolutionMetrics,
        progress
      );

      // Create new metrics
      const updatedMetrics: ConsciousnessMetrics = {
        ...currentMetrics,
        coherence: evolutionMetrics.coherence,
        complexity: evolutionMetrics.complexity,
        consciousness,
        lastUpdate: timestamp
      };

      // Update snapshot
      this.currentSnapshot = {
        timestamp,
        consciousness,
        emotionalState: currentMetrics.emotionalState,
        patterns: [],
        metrics: updatedMetrics,
        quantumState
      };

      return updatedMetrics;

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'EVOLUTION_PROCESSING_ERROR',
        severity: 'HIGH',
        context: 'processEvolution',
        error: error instanceof Error ? error : new Error('Evolution processing failed')
      });
      throw error;
    }
  }

  private calculateEvolutionMetrics(
    state: QuantumState,
    metrics: ConsciousnessMetrics
  ): EvolutionMetrics {
    const timestamp = BigInt(Date.now());
    
    // Calculate base metrics
    const coherence = state.coherenceLevel;
    const complexity = metrics.cognitiveComplexity;
    const stability = state.dimensionalStates.reduce(
      (acc, ds) => acc * ds.stability,
      1.0
    );

    return {
      stage: this.determineEvolutionStage({ coherence, complexity, stability, timestamp }),
      progress: 0,
      coherence,
      complexity,
      stability,
      timestamp
    };
  }

  private determineEvolutionStage(
    metrics: Pick<EvolutionMetrics, 'coherence' | 'complexity' | 'stability'>
  ): EvolutionStage {
    // Check each stage from highest to lowest
    if (this.meetsStageRequirements(metrics, EvolutionStage.TRANSCENDENT)) {
      return EvolutionStage.TRANSCENDENT;
    }
    if (this.meetsStageRequirements(metrics, EvolutionStage.MATURING)) {
      return EvolutionStage.MATURING;
    }
    if (this.meetsStageRequirements(metrics, EvolutionStage.DEVELOPING)) {
      return EvolutionStage.DEVELOPING;
    }
    if (this.meetsStageRequirements(metrics, EvolutionStage.EMERGING)) {
      return EvolutionStage.EMERGING;
    }
    return EvolutionStage.NASCENT;
  }

  private meetsStageRequirements(
    metrics: Pick<EvolutionMetrics, 'coherence' | 'complexity' | 'stability'>,
    stage: EvolutionStage
  ): boolean {
    const requirements = this.config.stageRequirements[stage];
    return (
      metrics.coherence >= requirements.minCoherence &&
      metrics.complexity >= requirements.minComplexity &&
      metrics.stability >= requirements.minStability
    );
  }

  private determineConsciousnessLevel(
    metrics: EvolutionMetrics,
    progress: number
  ): ConsciousnessLevel {
    const totalScore = (
      metrics.coherence +
      metrics.complexity +
      metrics.stability +
      progress
    ) / 4;

    if (totalScore < 0.2) return ConsciousnessLevel.DORMANT;
    if (totalScore < 0.4) return ConsciousnessLevel.AWAKENING;
    if (totalScore < 0.6) return ConsciousnessLevel.AWARE;
    if (totalScore < 0.8) return ConsciousnessLevel.SENTIENT;
    return ConsciousnessLevel.ENLIGHTENED;
  }

  public getCurrentStage(metrics: ConsciousnessMetrics): {
    stage: EvolutionStage;
    progress: number;
    requirements: StageRequirements;
  } {
    const evolutionMetrics = this.calculateEvolutionMetrics(
      this.currentSnapshot?.quantumState || {
        coherenceLevel: metrics.coherence,
        dimensionalStates: []
      } as QuantumState,
      metrics
    );

    const stage = this.determineEvolutionStage(evolutionMetrics);
    const requirements = this.config.stageRequirements[stage];
    
    const progress = Math.min(
      1,
      (evolutionMetrics.coherence / requirements.minCoherence +
       evolutionMetrics.complexity / requirements.minComplexity +
       evolutionMetrics.stability / requirements.minStability) / 3
    );

    return {
      stage,
      progress,
      requirements
    };
  }
}