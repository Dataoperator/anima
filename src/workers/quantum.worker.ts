import { QuantumState, ResonancePattern } from '../quantum/types';
import { generateQuantumSignature } from '../utils/quantum';

type WorkerPayload = {
    type: 'calculateCoherence' | 'generatePattern' | 'updateQuantumState';
    data: any;
};

const handlers = {
    calculateCoherence: (patterns: ResonancePattern[]) => {
        const now = Date.now();
        const coherenceValues = patterns.map(p => p.coherence);
        const averageCoherence = coherenceValues.reduce((a, b) => a + b, 0) / patterns.length;
        
        return {
            coherenceLevel: averageCoherence
        };
    },

    generatePattern: (previousPatterns: ResonancePattern[], baseCoherence: number) => {
        const now = Date.now();
        const prevPattern = previousPatterns[previousPatterns.length - 1];
        
        // Calculate shifts based on previous pattern
        const coherenceShift = (Math.random() - 0.5) * 0.1;
        const strengthShift = (Math.random() - 0.5) * 0.1;
        const harmonicShift = (Math.random() - 0.5) * 0.1;
        
        const pattern: ResonancePattern = {
            id: `p-${now}`,
            pattern: generateQuantumSignature(),
            strength: prevPattern ? 
                Math.max(0, Math.min(1, prevPattern.strength + strengthShift)) :
                baseCoherence,
            coherence: prevPattern ?
                Math.max(0, Math.min(1, prevPattern.coherence + coherenceShift)) :
                baseCoherence,
            evolutionPotential: Math.random(),
            quantumPotential: Math.random(),
            coherenceQuality: Math.random(),
            stabilityIndex: Math.random(),
            dimensionalHarmony: prevPattern ?
                Math.max(0, Math.min(1, prevPattern.dimensionalHarmony + harmonicShift)) :
                baseCoherence,
            timestamp: now,
            patternType: 'quantum'
        };

        return { pattern };
    },

    updateQuantumState: (
        currentState: QuantumState,
        newPatterns: ResonancePattern[]
    ) => {
        const patternCoherence = newPatterns.reduce(
            (acc, p) => acc + p.coherence, 
            0
        ) / newPatterns.length;

        const metrics = new Map([
            ['coherenceGrowth', patternCoherence * 0.1],
            ['dimensionalHarmony', newPatterns[0]?.dimensionalHarmony || 0]
        ]);

        return {
            coherenceLevel: Math.min(1, (currentState.coherenceLevel || 0) + (metrics.get('coherenceGrowth') || 0)),
            resonanceQuality: (currentState.dimensionalState?.resonance || 0) + (metrics.get('dimensionalHarmony') || 0)
        };
    }
};

self.onmessage = async (event: MessageEvent<WorkerPayload>) => {
    const { type, data } = event.data;
    
    if (!handlers[type]) {
        throw new Error(`Unknown handler type: ${type}`);
    }

    try {
        const result = await handlers[type](data);
        self.postMessage({ type, result });
    } catch (error) {
        self.postMessage({ 
            type, 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};