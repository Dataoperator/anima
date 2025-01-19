import { PatternRecognizer } from '../PatternRecognizer';
import { Pattern, PatternContext, Emotion } from '../../../../types/patterns';

describe('PatternRecognizer', () => {
  let recognizer: PatternRecognizer;
  const mockContext: PatternContext = {
    quantum: {
      coherenceLevel: 0.8
    },
    emotional: {
      alignment: 0.7,
      dominantEmotion: 'joy'
    },
    environmental: {
      timeOfDay: 14,
      activity: 'focused',
      platform: 'optimal'
    }
  };

  beforeEach(() => {
    recognizer = new PatternRecognizer();
  });

  it('should recognize basic behavioral patterns', async () => {
    const input: Pattern = {
      id: 'test-pattern',
      type: 'behavioral',
      baseCoherence: 0.8,
      basePhase: 0,
      dimensionalPatterns: [1, 0.9, 0.8],
      timestamp: Date.now(),
      strength: 0.9,
      emotionalSignature: {
        dominant: 'joy',
        intensity: 0.8,
        stability: 0.7
      }
    };

    const existingPattern = { ...input, id: 'existing-pattern' };
    recognizer.addPattern(existingPattern);

    const result = await recognizer.recognizePattern(input, mockContext, 'behavioral');
    expect(result).toBeTruthy();
    expect(result?.similarity).toBeGreaterThan(0.5);
  });

  it('should adapt pattern recognition based on context', async () => {
    const input: Pattern = {
      id: 'test-input',
      type: 'emotional',
      baseCoherence: 0.7,
      basePhase: Math.PI / 4,
      dimensionalPatterns: [0.8, 0.7, 0.6],
      timestamp: Date.now(),
      strength: 0.8,
      emotionalSignature: {
        dominant: 'joy',
        intensity: 0.9,
        stability: 0.8
      }
    };

    // Add a matching pattern
    const existingPattern = {
      ...input,
      id: 'existing-pattern',
      baseCoherence: 0.75
    };
    recognizer.addPattern(existingPattern);

    // First recognition with high quantum coherence
    const initial = await recognizer.recognizePattern(input, {
      ...mockContext,
      quantum: { coherenceLevel: 0.9 }
    }, 'emotional');

    // Second recognition with lower quantum coherence
    const result = await recognizer.recognizePattern(input, {
      ...mockContext,
      quantum: { coherenceLevel: 0.5 }
    }, 'emotional');

    expect(initial?.confidence).toBeGreaterThan(result?.confidence || 0);
  });

  it('should handle multiple pattern types correctly', async () => {
    const behavioralInput: Pattern = {
      id: 'behavioral-input',
      type: 'behavioral',
      baseCoherence: 0.8,
      basePhase: 0,
      dimensionalPatterns: [1, 0.9, 0.8],
      timestamp: Date.now(),
      strength: 0.9,
      emotionalSignature: {
        dominant: 'joy',
        intensity: 0.8,
        stability: 0.7
      }
    };

    const emotionalInput: Pattern = {
      id: 'emotional-input',
      type: 'emotional',
      baseCoherence: 0.7,
      basePhase: Math.PI / 4,
      dimensionalPatterns: [0.8, 0.7, 0.6],
      timestamp: Date.now(),
      strength: 0.8,
      emotionalSignature: {
        dominant: 'joy',
        intensity: 0.9,
        stability: 0.8
      }
    };

    recognizer.addPattern({ ...behavioralInput, id: 'behavioral-1' });
    recognizer.addPattern({ ...emotionalInput, id: 'emotional-1' });

    const behavioralResult = await recognizer.recognizePattern(behavioralInput, mockContext, 'behavioral');
    const emotionalResult = await recognizer.recognizePattern(emotionalInput, mockContext, 'emotional');

    expect(behavioralResult?.pattern.type).toBe('behavioral');
    expect(emotionalResult?.pattern.type).toBe('emotional');
  });

  it('should handle environmental factors in confidence calculation', async () => {
    const input: Pattern = {
      id: 'test-pattern',
      type: 'behavioral',
      baseCoherence: 0.8,
      basePhase: 0,
      dimensionalPatterns: [1, 0.9, 0.8],
      timestamp: Date.now(),
      strength: 0.9
    };

    recognizer.addPattern({ ...input, id: 'existing' });

    // Test with optimal conditions
    const optimalContext: PatternContext = {
      ...mockContext,
      environmental: {
        timeOfDay: 14,  // Middle of optimal period
        activity: 'focused',
        platform: 'optimal'
      }
    };

    const optimalResult = await recognizer.recognizePattern(input, optimalContext, 'behavioral');

    // Test with suboptimal conditions
    const suboptimalContext: PatternContext = {
      ...mockContext,
      environmental: {
        timeOfDay: 3,  // Late night
        activity: 'relaxed',
        platform: 'suboptimal'
      }
    };

    const suboptimalResult = await recognizer.recognizePattern(input, suboptimalContext, 'behavioral');

    expect(optimalResult?.confidence).toBeGreaterThan(suboptimalResult?.confidence || 0);
  });
});