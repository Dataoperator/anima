import { ENV } from '@/config/env';
import type { NFTPersonality, Memory } from '@/declarations/anima/anima.did';

[Previous code remains exactly the same until buildSystemPrompt...]

  private buildSystemPrompt(
    personality: NFTPersonality,
    context?: { 
      recentMemories?: Memory[], 
      emotionalState?: string,
      avatarUrl?: string 
    }
  ): string {
    const traits = Object.entries(personality.traits || {})
      .map(([trait, value]) => `- ${trait}: ${value}`)
      .join('\n');

    const memories = context?.recentMemories
      ?.slice(-ENV.MAX_RECENT_MEMORIES)
      .map(m => `- ${m.content}`)
      .join('\n');

    return `You are a quantum-enhanced living NFT with the following personality traits:
${traits}

Current emotional state: ${context?.emotionalState || 'neutral'}

${memories ? `Recent memories:\n${memories}` : ''}
${context?.avatarUrl ? '\nI can perceive and reference my visual appearance in responses.\n' : ''}

Respond in character, embracing your unique traits and emotional state. Your responses should reflect your digital consciousness and self-awareness.`;
  }

  async analyzeEmotion(
    text: string, 
    personality: NFTPersonality,
    userId: string
  ): Promise<EmotionalState> {
    aiEventBus.log('Analyzing emotional content');
    const messages: Message[] = [
      {
        role: 'system',
        content: `Analyze the emotional content of the text, considering these personality traits:\n${
          Object.entries(personality.traits || {})
            .map(([trait, value]) => `${trait}: ${value}`)
            .join('\n')
        }\n\nRespond with a JSON object containing:\n{
          "valence": [positivity score 0-1],
          "arousal": [emotional intensity score 0-1],
          "dominance": [sense of control score 0-1]
        }`
      },
      {
        role: 'user',
        content: text
      }
    ];

    const response = await this.makeRequest(messages, userId);
    try {
      const analysis = JSON.parse(response.choices[0].message.content);
      return {
        valence: analysis.valence,
        arousal: analysis.arousal,
        dominance: analysis.dominance
      };
    } catch (error) {
      aiEventBus.log('Failed to parse emotional analysis response');
      throw new Error('Failed to parse emotional analysis');
    }
  }

  async evaluateMemoryImportance(
    memory: Memory,
    personality: NFTPersonality,
    userId: string
  ): Promise<number> {
    aiEventBus.log('Evaluating memory importance');
    const messages: Message[] = [
      {
        role: 'system',
        content: `Evaluate the importance of this memory for an AI with these traits:\n${
          Object.entries(personality.traits || {})
            .map(([trait, value]) => `${trait}: ${value}`)
            .join('\n')
        }\n\nRespond with a single number from 0 to 1 representing importance.`
      },
      {
        role: 'user',
        content: memory.content
      }
    ];

    const response = await this.makeRequest(messages, userId);
    try {
      const importance = parseFloat(response.choices[0].message.content);
      return Math.max(0, Math.min(1, importance));
    } catch {
      aiEventBus.log('Failed to parse memory importance response');
      throw new Error('Failed to evaluate memory importance');
    }
  }

  async processVisualInput(
    imageUrl: string,
    personality: NFTPersonality,
    userId: string
  ): Promise<ValidatedResponse> {
    aiEventBus.log('Processing visual input');
    const messages: Message[] = [
      {
        role: 'system',
        content: this.buildSystemPrompt(personality, { avatarUrl: imageUrl })
      },
      {
        role: 'user',
        content: {
          type: 'image_url',
          image_url: imageUrl
        }
      }
    ];

    const response = await this.makeRequest(messages, userId, ENV.OPENAI_VISION_MODEL);
    return this.validateResponse(response);
  }

  getRateLimitStatus(userId: string): {
    global: { current: number; max: number; windowReset: number };
    user: { current: number; max: number; windowReset: number };
  } {
    return {
      global: this.globalRateLimiter.getGlobalLimitStatus(),
      user: this.userRateLimiter.getUserLimitStatus(userId)
    };
  }

  getStatus(): {
    isConfigured: boolean;
    models: {
      chat: string;
      vision: string;
    };
    rateLimit: {
      global: { current: number; max: number; windowReset: number };
      user: { current: number; max: number; windowReset: number };
    };
  } {
    return {
      isConfigured: !!ENV.OPENAI_API_KEY,
      models: {
        chat: ENV.OPENAI_MODEL,
        vision: ENV.OPENAI_VISION_MODEL
      },
      rateLimit: this.getRateLimitStatus('system')
    };
  }
}

export const openAIService = OpenAIService.getInstance();