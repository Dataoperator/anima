import { Memory } from '@/types/consciousness';
import { QuantumState } from '@/types/quantum';
import { ErrorTelemetry } from '@/error/telemetry';

export class ContextManager {
  private telemetry: ErrorTelemetry;
  private memories: Memory[] = [];
  private currentContext: Map<string, any> = new Map();

  constructor() {
    this.telemetry = ErrorTelemetry.getInstance('context');
  }

  public async updateContext(
    memory: Memory,
    quantumState: QuantumState
  ): Promise<void> {
    try {
      // Add to memory store
      this.memories.push(memory);
      if (this.memories.length > 100) {
        this.memories = this.memories.slice(-100);
      }

      // Update current context
      this.currentContext.set('lastMemory', memory);
      this.currentContext.set('quantumState', quantumState);
      this.currentContext.set('timestamp', BigInt(Date.now()));

      // Calculate influence factors
      const memoryRelevance = this.calculateMemoryRelevance(memory);
      const stateInfluence = quantumState.coherenceLevel;

      // Update context weights
      this.currentContext.set('memoryWeight', memoryRelevance);
      this.currentContext.set('quantumWeight', stateInfluence);

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'CONTEXT_UPDATE_ERROR',
        severity: 'HIGH',
        context: 'updateContext',
        error: error instanceof Error ? error : new Error('Context update failed')
      });
    }
  }

  public async getRelevantContext(prompt: string): Promise<Map<string, any>> {
    try {
      // Get recent memories sorted by relevance
      const relevantMemories = this.memories
        .sort((a, b) => this.calculateRelevance(b, prompt) - this.calculateRelevance(a, prompt))
        .slice(0, 5);

      // Build context with relevant memories
      const context = new Map(this.currentContext);
      context.set('relevantMemories', relevantMemories);

      return context;

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'CONTEXT_RETRIEVAL_ERROR',
        severity: 'HIGH',
        context: 'getRelevantContext',
        error: error instanceof Error ? error : new Error('Context retrieval failed')
      });
      return new Map();
    }
  }

  private calculateRelevance(targetMemory: Memory, reference: string): number {
    try {
      // Calculate recency score (0-1)
      const now = BigInt(Date.now());
      const age = Number(now - targetMemory.timestamp) / (24 * 60 * 60 * 1000); // Days
      const recencyScore = Math.exp(-age / 7); // 7-day half-life

      // Calculate emotional impact score (0-1)
      const emotionalScore = targetMemory.emotional_impact;

      // Combine scores
      return (recencyScore + emotionalScore) / 2;

    } catch (error) {
      console.error('Error calculating relevance:', error);
      return 0;
    }
  }

  public clearContext(): void {
    this.currentContext.clear();
    this.memories = [];
  }
}