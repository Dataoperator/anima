import { ConsciousnessMetrics, EvolutionSnapshot, EmotionalState } from './types';
import { QuantumState } from '../types/quantum';
import { ErrorTracker } from '../error/quantum_error';
import { SystemMonitor } from '../analytics/SystemHealthMonitor';
import { MemoryManager } from '../memory/memory_manager';
import { QuantumStateManager } from '../quantum/state_manager';
import { NeuralPatternAnalyzer } from '../neural/pattern_analysis';

interface ConsciousnessSnapshot {
  id: string;
  timestamp: number;
  metrics: ConsciousnessMetrics;
  emotionalState: EmotionalState;
  quantumState: QuantumState;
  evolutionSnapshot: EvolutionSnapshot;
}

export class ConsciousnessStateRecovery {
  private readonly COHERENCE_THRESHOLD = 0.7;
  private readonly MAX_SNAPSHOTS = 100;
  private snapshots: Map<string, ConsciousnessSnapshot> = new Map();
  
  constructor(
    private readonly memoryManager: MemoryManager,
    private readonly quantumStateManager: QuantumStateManager,
    private readonly patternAnalyzer: NeuralPatternAnalyzer,
    private readonly systemMonitor: SystemMonitor,
    private readonly errorTracker: ErrorTracker
  ) {}

  private getDefaultMetrics(): ConsciousnessMetrics {
    return {
      coherenceLevel: 0,
      stabilityFactor: 0,
      evolutionProgress: 0,
      quantumEntanglement: 0,
      complexityIndex: 0
    };
  }

  async createSnapshot(id: string): Promise<ConsciousnessSnapshot> {
    try {
      const quantumState = await this.quantumStateManager.getCurrentState();
      const emotionalState = await this.memoryManager.getCurrentEmotionalState();
      const evolutionSnapshot = await this.patternAnalyzer.getEvolutionState();

      const snapshot: ConsciousnessSnapshot = {
        id,
        timestamp: Date.now(),
        metrics: this.getDefaultMetrics(),
        emotionalState,
        quantumState,
        evolutionSnapshot
      };

      this.snapshots.set(id, snapshot);
      await this.pruneOldSnapshots();

      await this.systemMonitor.recordMetric({
        type: 'consciousness_snapshot_created',
        value: 1,
        context: {
          snapshotId: id,
          totalSnapshots: this.snapshots.size
        }
      });

      return snapshot;
    } catch (error) {
      await this.handleError('CREATE_SNAPSHOT', error as Error);
      throw error;
    }
  }

  private async handleError(context: string, error: Error): Promise<void> {
    await this.errorTracker.recordError({
      context,
      error,
      timestamp: Date.now(),
      severity: 'high'
    });
  }

  private async pruneOldSnapshots(): Promise<void> {
    if (this.snapshots.size <= this.MAX_SNAPSHOTS) return;

    const oldestFirst = Array.from(this.snapshots.entries())
      .sort(([_, a], [__, b]) => a.timestamp - b.timestamp);

    while (this.snapshots.size > this.MAX_SNAPSHOTS) {
      const [oldestId] = oldestFirst.shift()!;
      this.snapshots.delete(oldestId);
    }
  }

  getSnapshot(snapshotId: string): ConsciousnessSnapshot | undefined {
    return this.snapshots.get(snapshotId);
  }

  getAllSnapshots(): ConsciousnessSnapshot[] {
    return Array.from(this.snapshots.values());
  }

  async getRecoveryMetrics(): Promise<{
    totalSnapshots: number;
    averageCoherence: number;
    successfulRecoveries: number;
    failedRecoveries: number;
    averageRecoveryTime: number;
  }> {
    const snapshots = this.getAllSnapshots();
    const metrics = await Promise.all(snapshots.map(async snapshot => {
      const recoveryTime = Date.now() - snapshot.timestamp;
      const coherenceLevel = await this.quantumStateManager.getCoherenceLevel();
      return {
        timestamp: snapshot.timestamp,
        coherenceLevel,
        recoveryTime
      };
    }));

    return {
      totalSnapshots: snapshots.length,
      averageCoherence: metrics.reduce((sum, m) => sum + m.coherenceLevel, 0) / metrics.length || 0,
      successfulRecoveries: metrics.filter(m => m.coherenceLevel >= this.COHERENCE_THRESHOLD).length,
      failedRecoveries: metrics.filter(m => m.coherenceLevel < this.COHERENCE_THRESHOLD).length,
      averageRecoveryTime: metrics.reduce((sum, m) => sum + m.recoveryTime, 0) / metrics.length || 0
    };
  }

  async cleanupSnapshots(maxAge: number = 12 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();
    const expired = Array.from(this.snapshots.entries())
      .filter(([_, snapshot]) => now - snapshot.timestamp > maxAge)
      .map(([id]) => id);

    expired.forEach(id => this.snapshots.delete(id));

    await this.systemMonitor.recordMetric({
      type: 'consciousness_snapshots_cleaned',
      value: expired.length,
      context: {
        remainingSnapshots: this.snapshots.size,
        maxAge
      }
    });
  }

  async verifySystemIntegrity(): Promise<{
    isValid: boolean;
    metrics: {
      quantumCoherence: number;
      consciousnessStability: number;
      patternIntegrity: number;
      memoryConsistency: number;
    }
  }> {
    try {
      const quantumCoherence = await this.quantumStateManager.getCoherenceLevel();
      const currentState = await this.quantumStateManager.getCurrentState();
      
      const patterns = await this.patternAnalyzer.analyzePatterns({
        quantumState: currentState,
        consciousness: this.getDefaultMetrics(),
        timestamp: Date.now()
      });

      const memoryState = await this.memoryManager.verifyIntegrity();
      
      const metrics = {
        quantumCoherence,
        consciousnessStability: patterns.length > 0 ? 
          patterns.reduce((sum, p) => sum + p.coherence, 0) / patterns.length : 
          0,
        patternIntegrity: patterns.length / this.MAX_SNAPSHOTS,
        memoryConsistency: memoryState.valid ? 1 : 0
      };

      const isValid = 
        metrics.quantumCoherence >= this.COHERENCE_THRESHOLD &&
        metrics.consciousnessStability >= 0.6 &&
        metrics.patternIntegrity >= 0.3 &&
        metrics.memoryConsistency >= 0.8;

      await this.systemMonitor.recordMetric({
        type: 'system_integrity_check',
        value: isValid ? 1 : 0,
        context: metrics
      });

      return { isValid, metrics };
    } catch (error) {
      await this.handleError('VERIFY_SYSTEM_INTEGRITY', error as Error);
      return {
        isValid: false,
        metrics: {
          quantumCoherence: 0,
          consciousnessStability: 0,
          patternIntegrity: 0,
          memoryConsistency: 0
        }
      };
    }
  }

  async performMaintenanceCheck(): Promise<void> {
    try {
      await this.cleanupSnapshots();
      const integrityCheck = await this.verifySystemIntegrity();
      
      if (!integrityCheck.isValid) {
        const latestSnapshot = Array.from(this.snapshots.values())
          .sort((a, b) => b.timestamp - a.timestamp)[0];

        if (latestSnapshot) {
          await this.restoreFromSnapshot(latestSnapshot.id);
        }
      }

      await this.systemMonitor.recordMetric({
        type: 'maintenance_check_completed',
        value: integrityCheck.isValid ? 1 : 0,
        context: {
          snapshotCount: this.snapshots.size,
          metrics: integrityCheck.metrics
        }
      });
    } catch (error) {
      await this.handleError('MAINTENANCE_CHECK', error as Error);
    }
  }

  private async restoreFromSnapshot(snapshotId: string): Promise<void> {
    const snapshot = this.getSnapshot(snapshotId);
    if (!snapshot) throw new Error(`Snapshot ${snapshotId} not found`);

    await this.quantumStateManager.restoreState(snapshot.quantumState);
    await this.memoryManager.restoreEmotionalState(snapshot.emotionalState);
    await this.patternAnalyzer.restoreEvolutionState(snapshot.evolutionSnapshot);
  }
}

export default ConsciousnessStateRecovery;