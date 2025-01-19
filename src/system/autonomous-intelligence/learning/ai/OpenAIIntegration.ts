import { ErrorTelemetry } from '@/error/telemetry';

interface OpenAIResponse {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  finish_reason: string;
}

export class OpenAIIntegration {
  private telemetry: ErrorTelemetry;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.telemetry = ErrorTelemetry.getInstance('openai');
  }

  async generateResponse(
    prompt: string,
    systemContext: Record<string, unknown> = {}
  ): Promise<OpenAIResponse> {
    try {
      const actor = window.canister;
      if (!actor) throw new Error('Canister not initialized');

      // Call canister method that handles OpenAI interaction
      const result = await actor.generate_ai_response({
        prompt,
        systemContext,
        timestamp: BigInt(Date.now())
      });

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      return {
        text: result.Ok.text,
        usage: result.Ok.usage,
        finish_reason: result.Ok.finish_reason
      };

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'AI_GENERATION_ERROR',
        severity: 'HIGH',
        context: 'generateResponse',
        error: error instanceof Error ? error : new Error('AI response generation failed')
      });
      throw error;
    }
  }

  async validateResponse(response: string): Promise<boolean> {
    try {
      const actor = window.canister;
      if (!actor) throw new Error('Canister not initialized');

      const result = await actor.validate_ai_response({
        response,
        timestamp: BigInt(Date.now())
      });

      return 'Ok' in result && result.Ok;

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'AI_VALIDATION_ERROR',
        severity: 'MEDIUM',
        context: 'validateResponse',
        error: error instanceof Error ? error : new Error('AI response validation failed')
      });
      return false;
    }
  }

  async getRateLimitInfo(): Promise<{
    remaining: number;
    reset: number;
    limit: number;
  }> {
    try {
      const actor = window.canister;
      if (!actor) throw new Error('Canister not initialized');

      const result = await actor.get_rate_limit_info();

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      return result.Ok;

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'RATE_LIMIT_ERROR',
        severity: 'LOW',
        context: 'getRateLimitInfo',
        error: error instanceof Error ? error : new Error('Failed to get rate limit info')
      });
      throw error;
    }
  }
}