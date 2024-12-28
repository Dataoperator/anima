import { ActorSubclass } from '@dfinity/agent';
import type { _SERVICE } from '@/declarations/anima/anima.did';
import { PersonalityState, PersonalityUpdate, RealtimeHookState, UpdateType } from '@/types/realtime';
import { WebSocketService } from './websocket';

export class RealtimeService {
    private actor: ActorSubclass<_SERVICE>;
    private ws: WebSocketService;
    private updateHandlers: Map<string, (update: PersonalityUpdate) => void>;

    constructor(actor: ActorSubclass<_SERVICE>) {
        this.actor = actor;
        this.ws = new WebSocketService();
        this.updateHandlers = new Map();

        this.ws.onMessage(this.handleMessage.bind(this));
    }

    async subscribe(animaId: string, onUpdate: (update: PersonalityUpdate) => void): Promise<void> {
        try {
            // Store update handler
            this.updateHandlers.set(animaId, onUpdate);

            // Subscribe via WebSocket
            await this.ws.subscribe(animaId);

            // Get initial state
            const initialState = await this.getPersonalityState(animaId);
            onUpdate({
                type: UpdateType.UPDATE,
                data: initialState.personality
            });
        } catch (error) {
            console.error('Failed to subscribe:', error);
            throw error;
        }
    }

    async unsubscribe(animaId: string): Promise<void> {
        try {
            await this.ws.unsubscribe(animaId);
            this.updateHandlers.delete(animaId);
        } catch (error) {
            console.error('Failed to unsubscribe:', error);
            throw error;
        }
    }

    private handleMessage(message: MessageEvent): void {
        try {
            const update = JSON.parse(message.data) as PersonalityUpdate;
            const handler = this.updateHandlers.get(update.type === UpdateType.UPDATE ? update.data?.id : '');
            if (handler) {
                handler(update);
            }
        } catch (error) {
            console.error('Failed to handle message:', error);
        }
    }

    async getPersonalityState(animaId: string): Promise<RealtimeHookState> {
        try {
            const personality = await this.actor.get_personality_state(BigInt(animaId));
            return {
                personality: {
                    timestamp: personality.timestamp,
                    growth_level: personality.growth_level,
                    quantum_traits: this.convertTraits(personality.quantum_traits || {}),
                    base_traits: this.convertTraits(personality.base_traits || {}),
                    dimensional_awareness: personality.dimensional_awareness || undefined,
                    consciousness: personality.consciousness || undefined,
                    emotional_state: personality.emotional_state || undefined
                },
                loading: false,
                error: null
            };
        } catch (error) {
            console.error('Failed to get personality state:', error);
            throw error;
        }
    }

    private convertTraits(traits: Record<string, bigint | number>): Record<string, number> {
        return Object.entries(traits).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: typeof value === 'bigint' ? Number(value) : value
        }), {});
    }

    disconnect(): void {
        this.ws.disconnect();
        this.updateHandlers.clear();
    }
}