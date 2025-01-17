import { ENV } from '@/config/env';
import { aiEventBus } from '@/events/ai-event-bus';
import type { Message, StreamHandler } from '@/types';

export class OpenAIStream {
  private static instance: OpenAIStream;
  private controller: AbortController | null = null;

  static getInstance(): OpenAIStream {
    if (!OpenAIStream.instance) {
      OpenAIStream.instance = new OpenAIStream();
    }
    return OpenAIStream.instance;
  }

  private constructor() {}

  async streamCompletion(
    messages: Message[],
    handlers: StreamHandler,
    model: string = ENV.OPENAI_MODEL
  ): Promise<void> {
    this.controller = new AbortController();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: ENV.OPENAI_MAX_TOKENS,
          stream: true,
        }),
        signal: this.controller.signal
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response reader available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              handlers.onComplete?.();
              return;
            }

            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content;
              if (content) {
                handlers.onToken?.(content);
              }
            } catch (e) {
              console.error('Failed to parse stream data:', e);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        handlers.onCancel?.();
      } else {
        handlers.onError?.(error as Error);
        aiEventBus.error('Stream error', error as Error);
      }
    } finally {
      this.controller = null;
    }
  }

  cancelStream(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  isStreaming(): boolean {
    return this.controller !== null;
  }
}

export const openAIStream = OpenAIStream.getInstance();