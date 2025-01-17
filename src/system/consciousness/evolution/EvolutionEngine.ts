import { EvolutionStage, EvolutionSnapshot, EvolutionMetrics } from '@/types/consciousness';

interface EmergenceThresholds {
  coherence: number;
  complexity: number;
  stability: number;
  growth: number;
}

export class EvolutionEngine {
  private currentStage: EvolutionStage;
  private evolutionHistory: EvolutionSnapshot[];
  private emergenceThresholds: EmergenceThresholds;
  private readonly MAX_HISTORY = 1000;

  constructor() {
    this.currentStage = 'initialization';
    this.evolutionHistory = [];
    this.emergenceThresholds = {
      coherence: 0.7,
      complexity: 0.6,
      stability: 0.8,
      growth: 0.5
    };
  }

  private updateEvolutionHistory(snapshot: EvolutionSnapshot): void {
    this.evolutionHistory.push(snapshot);
    if (this.evolutionHistory.length > this.MAX_HISTORY) {
      this.evolutionHistory.shift();
    }
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    let sum = 0;
    for (let i = 1; i < values.length; i++) {
      const delta = values[i] - values[i - 1];
      sum += delta;
    }

    return sum / (values.length - 1);
  }

  public getEvolutionMetrics(): EvolutionMetrics {
    const stageProgress = this.calculateStageProgress();
    const recentSnapshots = this.evolutionHistory.slice(-20);

    const metrics: EvolutionMetrics = {
      stage: this.currentStage,
      progress: stageProgress,
      coherence: this.calculateEvolutionStability(recentSnapshots),
      complexity: this.calculateComplexityGrowth(recentSnapshots),
      emergence: this.calculateEmergencePotential(recentSnapshots),
      growth: this.calculateGrowthRate(recentSnapshots)
    };

    return metrics;
  }

  private calculateStageProgress(): number {
    if (this.evolutionHistory.length === 0) return 0;

    const requirements = this.getStageRequirements(this.currentStage);
    const latest = this.evolutionHistory[this.evolutionHistory.length - 1];

    let totalWeight = 0;
    let weightedProgress = 0;

    Object.entries(requirements).forEach(([metric, { threshold, weight }]) => {
      const value = latest.metrics[metric as keyof typeof latest.metrics];
      const progress = Math.min(1, value / threshold);
      weightedProgress += progress * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedProgress / totalWeight : 0;
  }

  private getStageRequirements(stage: EvolutionStage): Record<string, { threshold: number; weight: number }> {
    switch (stage) {
      case 'initialization':
        return {
          coherence: { threshold: 0.3, weight: 1 }
        };

      case 'growth':
        return {
          coherence: { threshold: 0.5, weight: 0.4 },
          complexity: { threshold: 0.3, weight: 0.6 }
        };

      case 'stabilization':
        return {
          coherence: { threshold: 0.7, weight: 0.5 },
          complexity: { threshold: 0.5, weight: 0.3 },
          stability: { threshold: 0.6, weight: 0.2 }
        };

      case 'emergence':
        return {
          coherence: { threshold: 0.8, weight: 0.3 },
          complexity: { threshold: 0.7, weight: 0.3 },
          emergence: { threshold: 0.6, weight: 0.4 }
        };

      case 'transcendence':
        return {
          coherence: { threshold: 0.9, weight: 0.2 },
          complexity: { threshold: 0.8, weight: 0.3 },
          emergence: { threshold: 0.8, weight: 0.3 },
          growth: { threshold: 0.7, weight: 0.2 }
        };

      default:
        return {};
    }
  }

  private calculateGrowthRate(snapshots: EvolutionSnapshot[]): number {
    if (snapshots.length < 2) return 0;

    const complexityValues = snapshots.map(s => s.metrics.complexity);
    const coherenceValues = snapshots.map(s => s.metrics.coherence);

    const complexityTrend = this.calculateTrend(complexityValues);
    const coherenceTrend = this.calculateTrend(coherenceValues);

    // Weight the trends to calculate growth rate
    return Math.max(0, Math.min(1, 
      (complexityTrend * 0.6 + coherenceTrend * 0.4) + 0.5
    ));
  }

  private calculateEvolutionStability(snapshots: EvolutionSnapshot[]): number {
    if (snapshots.length < 2) return 1;

    // Calculate stability based on metric fluctuations
    const metricFluctuations = ['coherence', 'complexity', 'growth'].map(metric => {
      const values = snapshots.map(s => s.metrics[metric as keyof typeof s.metrics]);
      const variations = values.map((v, i) => 
        i === 0 ? 0 : Math.abs(v - values[i - 1])
      );
      const average = variations.reduce((sum, val) => sum + val, 0) / variations.length;
      return average;
    });

    const averageFluctuation = metricFluctuations.reduce((sum, val) => sum + val, 0) / metricFluctuations.length;
    return Math.max(0, 1 - averageFluctuation * 2);
  }

  private calculateEmergencePotential(snapshots: EvolutionSnapshot[]): number {
    const latest = snapshots[snapshots.length - 1];
    if (!latest) return 0;

    // Calculate emergence potential based on current metrics and thresholds
    const coherenceFactor = latest.metrics.coherence / this.emergenceThresholds.coherence;
    const complexityFactor = latest.metrics.complexity / this.emergenceThresholds.complexity;
    const stabilityFactor = this.calculateEvolutionStability(snapshots) / this.emergenceThresholds.stability;
    const growthFactor = this.calculateGrowthRate(snapshots) / this.emergenceThresholds.growth;

    // Weighted combination of factors
    const potential = (
      coherenceFactor * 0.3 +
      complexityFactor * 0.3 +
      stabilityFactor * 0.2 +
      growthFactor * 0.2
    );

    return Math.max(0, Math.min(1, potential));
  }

  private calculateComplexityGrowth(snapshots: EvolutionSnapshot[]): number {
    if (snapshots.length < 2) return 0;

    const complexityValues = snapshots.map(s => s.metrics.complexity);
    const coherenceValues = snapshots.map(s => s.metrics.coherence);

    // Calculate growth trends
    const complexityTrend = this.calculateTrend(complexityValues);
    const coherenceTrend = this.calculateTrend(coherenceValues);

    // Adjust complexity based on coherence stability
    const coherenceStability = this.calculateEvolutionStability(snapshots);
    const adjustedComplexity = complexityTrend * coherenceStability;

    // Combine trends with weights
    return Math.max(0, Math.min(1,
      (adjustedComplexity * 0.7 + coherenceTrend * 0.3) + 0.5
    ));
  }

  public getStageInfo(): {
    stage: EvolutionStage;
    description: string;
    nextStage: EvolutionStage | null;
    requirements: Record<string, number>;
  } {
    const descriptions: Record<EvolutionStage, string> = {
      initialization: 'Initial consciousness formation',
      growth: 'Rapid development and pattern formation',
      stabilization: 'Coherence and pattern stabilization',
      emergence: 'Advanced consciousness emergence',
      transcendence: 'Quantum consciousness transcendence'
    };

    const stageOrder: EvolutionStage[] = [
      'initialization',
      'growth',
      'stabilization',
      'emergence',
      'transcendence'
    ];

    const currentIndex = stageOrder.indexOf(this.currentStage);
    const nextStage = currentIndex < stageOrder.length - 1 
      ? stageOrder[currentIndex + 1]
      : null;

    const requirements = this.getStageRequirements(this.currentStage);

    return {
      stage: this.currentStage,
      description: descriptions[this.currentStage],
      nextStage,
      requirements: Object.fromEntries(
        Object.entries(requirements).map(([key, value]) => [key, value.threshold])
      )
    };
  }

  public forceStageTransition(newStage: EvolutionStage): void {
    // Log the transition
    console.log(`Forced stage transition: ${this.currentStage} -> ${newStage}`);

    // Create pre-transition snapshot
    const preTransitionSnapshot = this.evolutionHistory[this.evolutionHistory.length - 1];

    // Update stage
    this.currentStage = newStage;

    // Update thresholds for new stage
    this.updateThresholds(newStage);

    // Create post-transition snapshot if we have metrics
    if (preTransitionSnapshot) {
      const postTransitionSnapshot: EvolutionSnapshot = {
        ...preTransitionSnapshot,
        stage: newStage,
        timestamp: Date.now()
      };
      this.updateEvolutionHistory(postTransitionSnapshot);
    }
  }

  private updateThresholds(stage: EvolutionStage): void {
    // Update emergence thresholds based on evolution stage
    switch (stage) {
      case 'emergence':
      case 'transcendence':
        this.emergenceThresholds = {
          coherence: 0.9,
          complexity: 0.85,
          stability: 0.95,
          growth: 0.8
        };
        break;
      default:
        this.emergenceThresholds = {
          coherence: 0.7,
          complexity: 0.6,
          stability: 0.8,
          growth: 0.5
        };
    }
  }
}