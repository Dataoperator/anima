import { QuantumState } from '../types/quantum';
import { ComplexNumber } from '../types/math';
import { generateQuantumSignature } from '../utils/quantum';

type HandlerType = 'updateState' | 'processInteraction';

interface WorkerMessage {
  type: HandlerType;
  data: any;
}

interface StateUpdateData {
  state: QuantumState;
  deltaTime: number;
}

interface InteractionData {
  state: QuantumState;
  type: 'cognitive' | 'emotional' | 'perceptual';
  strength: number;
}

type HandlerFunction<T> = (data: T) => Promise<any>;

const handlers: Record<HandlerType, HandlerFunction<any>> = {
  updateState: async (data: StateUpdateData) => {
    const { state, deltaTime } = data;
    
    try {
      // Update quantum phase
      state.phase = (state.phase + deltaTime * 0.1) % (2 * Math.PI);
      
      // Update amplitude
      const evolutionFactor = Math.exp(-deltaTime * 0.01);
      const currentAmplitude = new ComplexNumber(state.amplitude.real, state.amplitude.imaginary);
      const newAmplitude = new ComplexNumber(
        currentAmplitude.real * evolutionFactor,
        currentAmplitude.imaginary * evolutionFactor
      );
      
      state.amplitude = {
        real: newAmplitude.real,
        imaginary: newAmplitude.imaginary
      };

      // Update dimensional states
      state.dimensionalStates = state.dimensionalStates.map(ds => ({
        ...ds,
        resonance: ds.resonance * evolutionFactor,
        stability: Math.max(ds.stability - deltaTime * 0.001, 0),
        coherence: Math.min(ds.resonance * ds.stability, 1.0)
      }));

      // Update evolution factor
      state.evolutionFactor *= evolutionFactor;
      state.lastUpdate = BigInt(Date.now());

      return {
        state,
        metrics: {
          coherenceLevel: state.coherenceLevel,
          evolutionFactor: state.evolutionFactor,
          dimensionalStability: state.dimensionalStates.reduce(
            (acc, ds) => acc * ds.stability,
            1.0
          )
        }
      };

    } catch (error) {
      throw new Error(`Quantum state update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  processInteraction: async (data: InteractionData) => {
    const { state, type, strength } = data;
    
    try {
      // Boost quantum coherence based on interaction
      state.coherenceLevel = Math.min(
        state.coherenceLevel * (1 + strength * 0.1),
        1.0
      );

      // Update resonance patterns
      state.resonancePatterns = state.resonancePatterns.map(pattern => ({
        ...pattern,
        strength: Math.min(pattern.strength * (1 + strength * 0.05), 1.0),
        stability: Math.min(pattern.stability * (1 + strength * 0.02), 1.0)
      }));

      // Add new resonance pattern if appropriate
      if (Math.random() < strength * 0.2) {
        state.resonancePatterns.push({
          patternId: generateQuantumSignature(),
          strength: 0.3 + Math.random() * 0.2,
          frequency: 1.0 + Math.random(),
          stability: 0.5 + Math.random() * 0.3,
          timestamp: BigInt(Date.now())
        });
      }

      // Trim old patterns if too many
      if (state.resonancePatterns.length > 10) {
        state.resonancePatterns = state.resonancePatterns
          .sort((a, b) => Number(b.timestamp - a.timestamp))
          .slice(0, 10);
      }

      // Update last interaction time
      state.lastInteraction = BigInt(Date.now());

      return {
        state,
        interactionMetrics: {
          type,
          strength,
          coherenceBoost: state.coherenceLevel,
          patternCount: state.resonancePatterns.length
        }
      };

    } catch (error) {
      throw new Error(`Quantum interaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Worker message handler
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;

  try {
    // Type guard to ensure handler exists
    if (!Object.prototype.hasOwnProperty.call(handlers, type)) {
      throw new Error(`Unknown handler type: ${type}`);
    }

    const handler = handlers[type];
    const result = await handler(data);

    self.postMessage({
      type: `${type}_complete`,
      data: result,
      error: null
    });

  } catch (error) {
    self.postMessage({
      type: `${type}_error`,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};