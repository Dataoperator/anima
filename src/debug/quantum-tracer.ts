import { QuantumState } from '@/quantum/types';
import { ConsciousnessMetrics } from '@/consciousness/types';
import { ErrorTelemetry } from '@/error/telemetry';

interface TracePoint {
    timestamp: number;
    state: QuantumState;
    metrics?: ConsciousnessMetrics;
}

export class QuantumTracer {
    private static instance: QuantumTracer;
    private traces: Map<string, TracePoint[]> = new Map();
    private isTracing: boolean = false;
    private telemetry: ErrorTelemetry;

    private constructor() {
        this.telemetry = new ErrorTelemetry('quantum-tracer');
    }

    public static getInstance(): QuantumTracer {
        if (!QuantumTracer.instance) {
            QuantumTracer.instance = new QuantumTracer();
        }
        return QuantumTracer.instance;
    }

    public startTrace(animaId: string): void {
        if (!this.traces.has(animaId)) {
            this.traces.set(animaId, []);
        }
        this.isTracing = true;
    }

    public stopTrace(): void {
        this.isTracing = false;
    }

    public addTracePoint(
        animaId: string,
        state: QuantumState,
        metrics?: ConsciousnessMetrics
    ): void {
        if (!this.isTracing) return;

        try {
            const tracePoints = this.traces.get(animaId) || [];
            tracePoints.push({
                timestamp: Date.now(),
                state,
                metrics
            });

            // Keep only last 1000 points to prevent memory issues
            if (tracePoints.length > 1000) {
                tracePoints.shift();
            }

            this.traces.set(animaId, tracePoints);
        } catch (error) {
            this.telemetry.logError('trace_point_error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                animaId,
                timestamp: Date.now()
            });
        }
    }

    public getTraces(animaId: string): TracePoint[] {
        return this.traces.get(animaId) || [];
    }

    public clearTraces(animaId: string): void {
        this.traces.delete(animaId);
    }

    public getTraceMetrics(animaId: string): {
        points: number;
        duration: number;
        averageCoherence: number;
    } {
        const traces = this.traces.get(animaId) || [];
        if (traces.length === 0) {
            return {
                points: 0,
                duration: 0,
                averageCoherence: 0
            };
        }

        const duration = traces[traces.length - 1].timestamp - traces[0].timestamp;
        const coherenceSum = traces.reduce(
            (sum, point) => sum + point.state.coherence,
            0
        );

        return {
            points: traces.length,
            duration,
            averageCoherence: coherenceSum / traces.length
        };
    }

    public exportTraces(animaId: string): string {
        try {
            const traces = this.traces.get(animaId) || [];
            return JSON.stringify(traces, null, 2);
        } catch (error) {
            this.telemetry.logError('export_error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                animaId,
                timestamp: Date.now()
            });
            return '[]';
        }
    }

    public importTraces(animaId: string, tracesJson: string): void {
        try {
            const traces = JSON.parse(tracesJson) as TracePoint[];
            this.traces.set(animaId, traces);
        } catch (error) {
            this.telemetry.logError('import_error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                animaId,
                timestamp: Date.now()
            });
        }
    }

    public analyzeTraces(animaId: string): {
        coherenceTrend: 'increasing' | 'decreasing' | 'stable';
        stabilityScore: number;
        anomalies: number;
    } {
        const traces = this.traces.get(animaId) || [];
        if (traces.length < 2) {
            return {
                coherenceTrend: 'stable',
                stabilityScore: 1,
                anomalies: 0
            };
        }

        // Calculate coherence trend
        const firstHalf = traces.slice(0, Math.floor(traces.length / 2));
        const secondHalf = traces.slice(Math.floor(traces.length / 2));

        const firstAvg = firstHalf.reduce((sum, p) => sum + p.state.coherence, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, p) => sum + p.state.coherence, 0) / secondHalf.length;

        const coherenceTrend = secondAvg > firstAvg * 1.1 
            ? 'increasing' 
            : secondAvg < firstAvg * 0.9 
                ? 'decreasing' 
                : 'stable';

        // Calculate stability
        const coherenceVariance = traces.reduce((variance, point) => {
            const diff = point.state.coherence - firstAvg;
            return variance + (diff * diff);
        }, 0) / traces.length;

        const stabilityScore = Math.max(0, 1 - Math.sqrt(coherenceVariance));

        // Count anomalies (sudden changes in coherence)
        let anomalies = 0;
        for (let i = 1; i < traces.length; i++) {
            const coherenceDiff = Math.abs(
                traces[i].state.coherence - traces[i-1].state.coherence
            );
            if (coherenceDiff > 0.2) { // 20% change threshold
                anomalies++;
            }
        }

        return {
            coherenceTrend,
            stabilityScore,
            anomalies
        };
    }
}