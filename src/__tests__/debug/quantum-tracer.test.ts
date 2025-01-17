import { QuantumTracer } from '../../debug/quantum-tracer';
import { QuantumState } from '../../types/quantum';
import { ErrorTracker } from '../../error/quantum_error';

describe('QuantumTracer', () => {
    let quantumTracer: QuantumTracer;
    let mockErrorTracker: jest.Mocked<ErrorTracker>;

    beforeEach(() => {
        mockErrorTracker = {
            recordError: jest.fn(),
            getErrors: jest.fn(),
            clearErrors: jest.fn()
        };

        quantumTracer = new QuantumTracer(mockErrorTracker);
    });

    it('should initialize with empty trace history', () => {
        expect(quantumTracer.getTraceHistory()).toHaveLength(0);
    });

    it('should record quantum state changes', () => {
        const mockState: QuantumState = {
            coherenceLevel: 0.8,
            stabilityStatus: 'stable',
            resonancePatterns: [],
            quantumSignature: 'test-signature',
            dimensionalFrequency: 0.5,
            harmonicResonance: 0.7,
            dimensionalDepth: 0.6,
            evolutionFactor: 0.4
        };

        quantumTracer.recordStateChange(mockState);
        const history = quantumTracer.getTraceHistory();

        expect(history).toHaveLength(1);
        expect(history[0].state).toEqual(mockState);
        expect(history[0].timestamp).toBeDefined();
    });

    it('should maintain trace history size limit', () => {
        const mockState: QuantumState = {
            coherenceLevel: 0.8,
            stabilityStatus: 'stable',
            resonancePatterns: [],
            quantumSignature: 'test-signature',
            dimensionalFrequency: 0.5,
            harmonicResonance: 0.7,
            dimensionalDepth: 0.6,
            evolutionFactor: 0.4
        };

        // Add more states than the limit
        for (let i = 0; i < 105; i++) {
            quantumTracer.recordStateChange({
                ...mockState,
                quantumSignature: `test-signature-${i}`
            });
        }

        expect(quantumTracer.getTraceHistory()).toHaveLength(100);
        expect(quantumTracer.getTraceHistory()[0].state.quantumSignature)
            .toBe('test-signature-5');
    });

    it('should detect quantum anomalies', () => {
        const stableState: QuantumState = {
            coherenceLevel: 0.8,
            stabilityStatus: 'stable',
            resonancePatterns: [],
            quantumSignature: 'stable-signature',
            dimensionalFrequency: 0.5,
            harmonicResonance: 0.7,
            dimensionalDepth: 0.6,
            evolutionFactor: 0.4
        };

        const unstableState: QuantumState = {
            ...stableState,
            coherenceLevel: 0.2,
            stabilityStatus: 'unstable',
            quantumSignature: 'unstable-signature'
        };

        quantumTracer.recordStateChange(stableState);
        quantumTracer.recordStateChange(unstableState);

        const anomalies = quantumTracer.detectAnomalies();
        expect(anomalies).toHaveLength(1);
        expect(anomalies[0].type).toBe('coherence_drop');
    });

    it('should generate trace reports', () => {
        const mockState: QuantumState = {
            coherenceLevel: 0.8,
            stabilityStatus: 'stable',
            resonancePatterns: [],
            quantumSignature: 'test-signature',
            dimensionalFrequency: 0.5,
            harmonicResonance: 0.7,
            dimensionalDepth: 0.6,
            evolutionFactor: 0.4
        };

        quantumTracer.recordStateChange(mockState);
        const report = quantumTracer.generateReport();

        expect(report).toEqual(expect.objectContaining({
            traceCount: 1,
            averageCoherence: 0.8,
            anomalyCount: 0,
            stateChanges: expect.any(Array)
        }));
    });

    it('should handle errors gracefully', () => {
        const invalidState = null;
        
        // @ts-ignore - Testing invalid state
        quantumTracer.recordStateChange(invalidState);

        expect(mockErrorTracker.recordError).toHaveBeenCalledWith(
            expect.objectContaining({
                context: 'QUANTUM_TRACE',
                severity: 'high'
            })
        );
    });
});
