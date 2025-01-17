import { PatternRecognizer } from '../PatternRecognizer';

describe('PatternRecognizer', () => {
  let recognizer: PatternRecognizer;

  beforeEach(() => {
    recognizer = new PatternRecognizer();
  });

  describe('recognizePattern', () => {
    it('should create a new pattern when no similar patterns exist', async () => {
      const input = { action: 'click', target: 'button' };
      const context = {
        quantum: { coherenceLevel: 0.8 },
        emotional: { dominantEmotion: 'joy' },
        environmental: {
          timeOfDay: Date.now(),
          activity: 'testing',
          platform: 'web'
        }
      };

      const result = await recognizer.recognizePattern(input, context, 'behavioral');
      expect(result).toBeTruthy();
      expect(result?.type).toBe('behavioral');
      expect(result?.confidence).toBe(1.0);
    });

    it('should update existing pattern when similar pattern is found', async () => {
      const input = { action: 'click', target: 'button' };
      const context = {
        quantum: { coherenceLevel: 0.8 },
        emotional: { dominantEmotion: 'joy' },
        environmental: {
          timeOfDay: Date.now(),
          activity: 'testing',
          platform: 'web'
        }
      };

      // Create initial pattern
      const initial = await recognizer.recognizePattern(input, context, 'behavioral');
      expect(initial).toBeTruthy();

      // Recognize similar pattern
      const result = await recognizer.recognizePattern(input, context, 'behavioral');
      expect(result?.id).toBe(initial?.id);
      expect(result?.frequency).toBe(2);
    });
  });

  describe('getPatternsByType', () => {
    it('should return patterns filtered by type', async () => {
      const behavioralInput = { action: 'click' };
      const emotionalInput = { emotion: 'joy' };
      const context = {
        quantum: { coherenceLevel: 0.8 },
        emotional: { dominantEmotion: 'joy' },
        environmental: {
          timeOfDay: Date.now(),
          activity: 'testing',
          platform: 'web'
        }
      };

      await recognizer.recognizePattern(behavioralInput, context, 'behavioral');
      await recognizer.recognizePattern(emotionalInput, context, 'emotional');

      const behavioralPatterns = recognizer.getPatternsByType('behavioral');
      expect(behavioralPatterns.length).toBe(1);
      expect(behavioralPatterns[0].type).toBe('behavioral');

      const emotionalPatterns = recognizer.getPatternsByType('emotional');
      expect(emotionalPatterns.length).toBe(1);
      expect(emotionalPatterns[0].type).toBe('emotional');
    });
  });

  describe('getRecentPatterns', () => {
    it('should return patterns within time window', async () => {
      const input = { action: 'click' };
      const context = {
        quantum: { coherenceLevel: 0.8 },
        emotional: { dominantEmotion: 'joy' },
        environmental: {
          timeOfDay: Date.now(),
          activity: 'testing',
          platform: 'web'
        }
      };

      await recognizer.recognizePattern(input, context, 'behavioral');
      
      const recentPatterns = recognizer.getRecentPatterns(1000); // 1 second window
      expect(recentPatterns.length).toBe(1);

      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const oldPatterns = recognizer.getRecentPatterns(1000);
      expect(oldPatterns.length).toBe(0);
    });
  });
});