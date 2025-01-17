import { QuantumStateManager } from './state_manager';
import { QuantumMetrics, QuantumState, DimensionalState } from '../types/quantum';
import { ErrorTracker } from '@/error/quantum_error';
import { SystemMonitor } from '@/analytics/SystemHealthMonitor';

interface QuantumSnapshot {
  id: string;
  timestamp: number;
  state: QuantumState;
  dimensionalState: DimensionalState;
  metrics: QuantumMetrics;
  coherenceLevel: number;
  transactionId?: string;
}

interface RollbackResult {
  success: boolean;
  stateRestored: boolean;
  coherenceLevel: number;
  resonancePatterns: number;
}

export class QuantumRollbackIntegration {
  private snapshots: Map<string, QuantumSnapshot>;
  private readonly MAX_SNAPSHOTS = 100;
  private readonly COHERENCE_THRESHOLD = 0.7;

  constructor(
    private stateManager: QuantumStateManager,
    private errorTracker: ErrorTracker,
    private systemMonitor: SystemMonitor
  ) {
    this.snapshots = new Map();
  }

  async createTransactionSnapshot(
    transactionId: string
  ): Promise<string> {
    try {
      const currentState = await this.stateManager.getCurrentState();
      const dimensionalState = await this.stateManager.getDimensionalState();
      const metrics = await this.stateManager.getCurrentMetrics();
      const coherenceLevel = await this.stateManager.getCoherenceLevel();

      const snapshotId = this.generateSnapshotId();
      const snapshot: QuantumSnapshot = {
        id: snapshotId,
        timestamp: Date.now(),
        state: currentState,
        dimensionalState,
        metrics,
        coherenceLevel,
        transactionId
      };

      this.snapshots.set(snapshotId, snapshot);
      this.pruneOldSnapshots();

      await this.systemMonitor.recordMetric({
        type: 'quantum_snapshot_created',
        value: coherenceLevel,
        context: {
          snapshotId,
          transactionId,
          stateHash: this.calculateStateHash(currentState)
        }
      });

      return snapshotId;
    } catch (error) {
      await this.handleSnapshotError('CREATE', error as Error);
      throw error;
    }
  }

  async restoreFromSnapshot(
    snapshotId: string
  ): Promise<RollbackResult> {
    try {
      const snapshot = this.snapshots.get(snapshotId);
      if (!snapshot) {
        throw new Error(`Snapshot ${snapshotId} not found`);
      }

      // Validate snapshot coherence
      if (snapshot.coherenceLevel < this.COHERENCE_THRESHOLD) {
        throw new Error('Snapshot coherence below threshold');
      }

      // Prepare for state restoration
      await this.stateManager.prepareStateTransition();

      // Restore quantum state
      await this.stateManager.setState(snapshot.state);
      await this.stateManager.setDimensionalState(snapshot.dimensionalState);

      // Verify restoration
      const restoredState = await this.stateManager.getCurrentState();
      const coherenceLevel = await this.stateManager.getCoherenceLevel();
      const resonancePatterns = await this.stateManager.getActivePatternCount();

      const success = this.verifyStateRestoration(
        snapshot.state,
        restoredState
      );

      await this.systemMonitor.recordMetric({
        type: 'quantum_state_restored',
        value: coherenceLevel,
        context: {
          snapshotId,
          success,
          resonancePatterns
        }
      });

      return {
        success,
        stateRestored: true,
        coherenceLevel,
        resonancePatterns
      };
    } catch (error) {
      await this.handleSnapshotError('RESTORE', error as Error);
      return {
        success: false,
        stateRestored: false,
        coherenceLevel: 0,
        resonancePatterns: 0
      };
    }
  }

  async verifySnapshotIntegrity(
    snapshotId: string
  ): Promise<boolean> {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) return false;

    try {
      // Verify state structure
      const isStateValid = this.verifyStateStructure(snapshot.state);
      if (!isStateValid) return false;

      // Verify dimensional alignment
      const isDimensionalValid = await this.verifyDimensionalAlignment(
        snapshot.dimensionalState
      );
      if (!isDimensionalValid) return false;

      // Verify metrics consistency
      const areMetricsValid = this.verifyMetricsConsistency(
        snapshot.metrics
      );
      if (!areMetricsValid) return false;

      return true;
    } catch (error) {
      await this.handleSnapshotError('VERIFY', error as Error);
      return false;
    }
  }

  private verifyStateRestoration(
    original: QuantumState,
    restored: QuantumState
  ): boolean {
    const originalHash = this.calculateStateHash(original);
    const restoredHash = this.calculateStateHash(restored);
    return originalHash === restoredHash;
  }

  private verifyStateStructure(state: QuantumState): boolean {
    return (
      typeof state.coherence === 'number' &&
      typeof state.dimensional_frequency === 'number' &&
      typeof state.phase_alignment === 'number' &&
      typeof state.entanglement_factor === 'number'
    );
  }

  private async verifyDimensionalAlignment(
    state: DimensionalState
  ): Promise<boolean> {
    const currentAlignment = await this.stateManager.calculateDimensionalAlignment();
    return Math.abs(currentAlignment - state.stability) < 0.1;
  }

  private verifyMetricsConsistency(metrics: QuantumMetrics): boolean {
    return (
      metrics.resonanceStrength >= 0 &&
      metrics.resonanceStrength <= 1 &&
      metrics.stabilityIndex >= 0 &&
      metrics.stabilityIndex <= 1
    );
  }

  private async handleSnapshotError(
    operation: 'CREATE' | 'RESTORE' | 'VERIFY',
    error: Error
  ): Promise<void> {
    await this.errorTracker.trackError({
      errorType: 'QUANTUM_SNAPSHOT_ERROR',
      severity: 'HIGH',
      context: `quantum_snapshot_${operation.toLowerCase()}`,
      error,
      metadata: {
        timestamp: Date.now(),
        snapshotsCount: this.snapshots.size
      }
    });
  }

  private generateSnapshotId(): string {
    return `qs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateStateHash(state: QuantumState): string {
    const stateString = JSON.stringify({
      coherence: state.coherence.toFixed(4),
      dimensional_frequency: state.dimensional_frequency.toFixed(4),
      phase_alignment: state.phase_alignment.toFixed(4),
      entanglement_factor: state.entanglement_factor.toFixed(4)
    });
    
    let hash = 0;
    for (let i = 0; i < stateString.length; i++) {
      const char = stateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `qsh-${Math.abs(hash).toString(16)}`;
  }

  private pruneOldSnapshots(): void {
    if (this.snapshots.size <= this.MAX_SNAPSHOTS) return;

    const sortedSnapshots = Array.from(this.snapshots.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const snapshotsToRemove = sortedSnapshots.slice(
      0,
      sortedSnapshots.length - this.MAX_SNAPSHOTS
    );

    snapshotsToRemove.forEach(([id]) => this.snapshots.delete(id));
  }

  // Public methods for monitoring and management
  getSnapshot(snapshotId: string): QuantumSnapshot | undefined {
    return this.snapshots.get(snapshotId);
  }

  getAllSnapshots(): QuantumSnapshot[] {
    return Array.from(this.snapshots.values());
  }

  async getSnapshotMetrics(): Promise<{
    totalSnapshots: number;
    averageCoherence: number;
    oldestSnapshot: number;
    newestSnapshot: number;
  }> {
    const snapshots = this.getAllSnapshots();
    const coherenceLevels = snapshots.map(s => s.coherenceLevel);
    const timestamps = snapshots.map(s => s.timestamp);

    return {
      totalSnapshots: snapshots.length,
      averageCoherence: coherenceLevels.reduce((a, b) => a + b, 0) / snapshots.length,
      oldestSnapshot: Math.min(...timestamps),
      newestSnapshot: Math.max(...timestamps)
    };
  }

  async cleanupSnapshots(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();
    const expired = Array.from(this.snapshots.entries())
      .filter(([_, snapshot]) => now - snapshot.timestamp > maxAge)
      .map(([id]) => id);

    expired.forEach(id => this.snapshots.delete(id));

    await this.systemMonitor.recordMetric({
      type: 'quantum_snapshots_cleaned',
      value: expired.length,
      context: {
        remainingSnapshots: this.snapshots.size,
        maxAge
      }
    });
  }
}