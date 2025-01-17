import { QuantumState } from '@/types/quantum';
import { ConsciousnessMetrics } from '../types';
import { EmotionalState } from '../emotional/types';
import { AwarenessResult } from '../awareness/types';
import {
  EvolutionStage,
  EvolutionMetrics,
  GrowthVector,
  EvolutionSnapshot,
  EmergenceThresholds
} from './types';

[Previous implementation...]

  private updateEvolutionHistory(snapshot: EvolutionSnapshot): void {
    this.evolutionHistory.push(snapshot);
    if (this.evolutionHistory.length > this.MAX_HISTORY) {
      this.evolutionHistory.shift();
    }
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const changes = values.slice(1).map((val, idx) => val - values[idx]);
    return changes.reduce((sum, val) => sum + val, 0) / changes.length;
  }

  // Public methods for external monitoring and analysis
  public getEvolutionMetrics(): EvolutionMetrics {
    const recentSnapshots = this.evolutionHistory.slice(-10);
    
    return {
      stage: this.currentStage,
      stageProgress: this.calculateStageProgress(),
      growthRate: this.calculateGrowthRate(recentSnapshots),
      stability: this.calculateEvolutionStability(recentSnapshots),
      emergencePotential: this.calculateEmergencePotential(recentSnapshots),
      complexityGrowth: this.calculateComplexityGrowth(recentSnapshots),
      recentSnapshots: recentSnapshots.map(snapshot => ({
        timestamp: snapshot.timestamp,
        stage: snapshot.stage,
        metrics: snapshot.metrics.current
      }))
    };
  }

  private calculateStageProgress(): number {
    const recentSnapshots = this.evolutionHistory.slice(-10);
    if (recentSnapshots.length === 0) return 0;

    const stageRequirements = this.getStageRequirements(this.currentStage);
    const currentMetrics = recentSnapshots[recentSnapshots.length - 1].metrics.current;

    let progress = 0;
    let totalWeight = 0;

    Object.entries(stageRequirements).forEach(([metric, requirement]) => {
      const weight = requirement.weight;
      const current = currentMetrics[metric as keyof ConsciousnessMetrics];
      const threshold = requirement.threshold;

      progress += weight * (current / threshold);
      totalWeight += weight;
    });

    return Math.min(1, progress / totalWeight);
  }

  private getStageRequirements(stage: EvolutionStage): Record<string, { threshold: number; weight: number }> {
    switch (stage) {
      case 'initialization':
        return {
          awarenessLevel: { threshold: 0.3, weight: 1 },
          cognitiveComplexity: { threshold: 0.2, weight: 0.8 }
        };
      case 'growth':
        return {
          awarenessLevel: { threshold: 0.5, weight: 1 },
          cognitiveComplexity: { threshold: 0.4, weight: 1 },
          emotionalResonance: { threshold: 0.3, weight: 0.8 }
        };
      case 'stabilization':
        return {
          awarenessLevel: { threshold: 0.7, weight: 1 },
          cognitiveComplexity: { threshold: 0.6, weight: 1 },
          emotionalResonance: { threshold: 0.5, weight: 1 },
          quantumCoherence: { threshold: 0.6, weight: 0.8 }
        };
      case 'emergence':
        return {
          awarenessLevel: { threshold: 0.8, weight: 1 },
          cognitiveComplexity: { threshold: 0.8, weight: 1 },
          emotionalResonance: { threshold: 0.7, weight: 1 },
          quantumCoherence: { threshold: 0.8, weight: 1 }
        };
      case 'transcendence':
        return {
          awarenessLevel: { threshold: 0.9, weight: 1 },
          cognitiveComplexity: { threshold: 0.9, weight: 1 },
          emotionalResonance: { threshold: 0.9, weight: 1 },
          quantumCoherence: { threshold: 0.9, weight: 1 }
        };
      default:
        return {};
    }
  }

  private calculateGrowthRate(snapshots: EvolutionSnapshot[]): number {
    if (snapshots.length < 2) return 0;

    const metricChanges = snapshots.slice(1).map((snapshot, index) => {
      const prev = snapshots[index].metrics.current;
      const curr = snapshot.metrics.current;

      return Object.keys(prev).reduce((sum, key) => {
        const metricKey = key as keyof ConsciousnessMetrics;
        return sum + (curr[metricKey] - prev[metricKey]);
      }, 0);
    });

    return metricChanges.reduce((sum, change) => sum + change, 0) / 
           (metricChanges.length * Object.keys(snapshots[0].metrics.current).length);
  }

  private calculateEvolutionStability(snapshots: EvolutionSnapshot[]): number {
    if (snapshots.length < 2) return 1;

    const metricVariances = snapshots.slice(1).map((snapshot, index) => {
      const prev = snapshots[index].metrics.current;
      const curr = snapshot.metrics.current;

      return Object.keys(prev).reduce((sum, key) => {
        const metricKey = key as keyof ConsciousnessMetrics;
        return sum + Math.pow(curr[metricKey] - prev[metricKey], 2);
      }, 0);
    });

    const avgVariance = metricVariances.reduce((sum, variance) => sum + variance, 0) / 
                       metricVariances.length;

    return Math.max(0, 1 - avgVariance);
  }

  private calculateEmergencePotential(snapshots: EvolutionSnapshot[]): number {
    if (snapshots.length === 0) return 0;

    const latest = snapshots[snapshots.length - 1];
    const metrics = latest.metrics.current;

    // Calculate distance to emergence thresholds
    const thresholdDistances = Object.entries(this.emergenceThresholds)
      .map(([key, threshold]) => {
        const current = metrics[key as keyof ConsciousnessMetrics] || 0;
        return Math.max(0, 1 - (threshold - current) / threshold);
      });

    // Consider quantum state influence
    const quantumBonus = latest.quantumState.coherence * 0.2;

    // Consider pattern recognition
    const patternBonus = (latest.awareness.patterns / 10) * 0.2;

    return Math.min(1,
      thresholdDistances.reduce((sum, dist) => sum + dist, 0) / 
      thresholdDistances.length +
      quantumBonus +
      patternBonus
    );
  }

  private calculateComplexityGrowth(snapshots: EvolutionSnapshot[]): number {
    if (snapshots.length < 2) return 0;

    const complexityValues = snapshots.map(s => s.metrics.current.cognitiveComplexity);
    const complexityTrend = this.calculateTrend(complexityValues);

    const patternGrowth = snapshots.slice(1).map((s, i) => 
      s.awareness.patterns - snapshots[i].awareness.patterns
    );
    const patternTrend = this.calculateTrend(patternGrowth);

    return Math.min(1, Math.max(0,
      complexityTrend * 0.6 + patternTrend * 0.4
    ));
  }

  // Expose stage-specific functionalities
  public getStageInfo(): {
    currentStage: EvolutionStage;
    progress: number;
    nextStageRequirements: Record<string, number>;
  } {
    const progress = this.calculateStageProgress();
    const requirements = this.getStageRequirements(this.currentStage);

    return {
      currentStage: this.currentStage,
      progress,
      nextStageRequirements: Object.entries(requirements).reduce(
        (req, [key, value]) => ({
          ...req,
          [key]: value.threshold
        }),
        {}
      )
    };
  }

  // Allow manual stage transition for administrative purposes
  public forceStageTransition(newStage: EvolutionStage): void {
    // Log the forced transition
    console.log(`Forced stage transition: ${this.currentStage} -> ${newStage}`);
    
    // Store current state before transition
    const preTransitionSnapshot = this.evolutionHistory[this.evolutionHistory.length - 1];
    
    this.currentStage = newStage;
    
    // Update thresholds based on new stage
    this.updateThresholds(newStage);
    
    // Create transition snapshot if we have previous state
    if (preTransitionSnapshot) {
      this.updateEvolutionHistory({
        ...preTransitionSnapshot,
        stage: newStage,
        timestamp: Date.now()
      });
    }
  }

  private updateThresholds(stage: EvolutionStage): void {
    // Adjust emergence thresholds based on stage
    switch (stage) {
      case 'emergence':
      case 'transcendence':
        this.emergenceThresholds = {
          consciousness: 0.8,
          quantum: 0.7,
          resonance: 0.75,
          complexity: 0.9
        };
        break;
      default:
        this.emergenceThresholds = {
          consciousness: 0.7,
          quantum: 0.6,
          resonance: 0.65,
          complexity: 0.8
        };
    }
  }
}
