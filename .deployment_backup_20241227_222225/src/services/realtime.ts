import { Actor } from '@dfinity/agent';
import { RealtimeMessage, PersonalityUpdate } from '@/types/realtime';
import { WebSocketService } from './websocket';

export enum ConnectionMode {
    WEBSOCKET = 'WEBSOCKET',
    POLLING = 'POLLING'
}

export class RealtimeService {
    private static instance: RealtimeService;
    private subscriptions: Map<string, Set<(data: PersonalityUpdate) => void>>;
    private pollingIntervals: Map<string, number>;
    private actor: Actor;
    private wsService: WebSocketService;
    private connectionMode: ConnectionMode = ConnectionMode.WEBSOCKET;

    private constructor(actor: Actor) {
        this.actor = actor;
        this.subscriptions = new Map();
        this.pollingIntervals = new Map();
        this.wsService = WebSocketService.getInstance();
        this.initializeConnection();
    }

    public static getInstance(actor: Actor): RealtimeService {
        if (!RealtimeService.instance) {
            RealtimeService.instance = new RealtimeService(actor);
        }
        return RealtimeService.instance;
    }

    private async initializeConnection(): Promise<void> {
        try {
            const canisterId = process.env.CANISTER_ID_ANIMA || '';
            await this.wsService.connect(canisterId);
            this.connectionMode = ConnectionMode.WEBSOCKET;
        } catch (error) {
            console.warn('WebSocket connection failed, falling back to polling:', error);
            this.connectionMode = ConnectionMode.POLLING;
        }
    }

    public subscribe(animaId: string, callback: (data: PersonalityUpdate) => void): () => void {
        // Create new subscription set if it doesn't exist
        if (!this.subscriptions.has(animaId)) {
            this.subscriptions.set(animaId, new Set());
            
            if (this.connectionMode === ConnectionMode.WEBSOCKET) {
                this.subscribeWebSocket(animaId);
            } else {
                this.startPolling(animaId);
            }
        }

        // Add callback to subscriptions
        this.subscriptions.get(animaId)?.add(callback);

        // Return unsubscribe function
        return () => {
            const subs = this.subscriptions.get(animaId);
            if (subs) {
                subs.delete(callback);
                if (subs.size === 0) {
                    if (this.connectionMode === ConnectionMode.WEBSOCKET) {
                        // Cleanup WebSocket subscription
                        this.wsService.subscribe(animaId, () => {});
                    } else {
                        this.stopPolling(animaId);
                    }
                    this.subscriptions.delete(animaId);
                }
            }
        };
    }

    private subscribeWebSocket(animaId: string): void {
        this.wsService.subscribe(animaId, (update) => {
            this.notifySubscribers(animaId, update);
        });
    }

    private startPolling(animaId: string): void {
        if (this.pollingIntervals.has(animaId)) return;

        const poll = async () => {
            try {
                const update = await this.actor.get_personality_update(animaId);
                this.notifySubscribers(animaId, update);
            } catch (error) {
                console.error('Polling error:', error);
                // If polling fails, try to switch back to WebSocket
                this.tryReconnectWebSocket();
            }
        };

        // Initial poll
        poll();

        // Set up interval (every 2 seconds)
        const intervalId = window.setInterval(poll, 2000);
        this.pollingIntervals.set(animaId, intervalId);
    }

    private async tryReconnectWebSocket(): Promise<void> {
        try {
            await this.initializeConnection();
            if (this.connectionMode === ConnectionMode.WEBSOCKET) {
                // If successful, migrate all subscriptions to WebSocket
                this.migrateToWebSocket();
            }
        } catch (error) {
            console.error('WebSocket reconnection failed:', error);
        }
    }

    private migrateToWebSocket(): void {
        // Stop all polling
        for (const [animaId, intervalId] of this.pollingIntervals.entries()) {
            window.clearInterval(intervalId);
            this.pollingIntervals.delete(animaId);
            // Set up WebSocket subscription
            this.subscribeWebSocket(animaId);
        }
    }

    private stopPolling(animaId: string): void {
        const intervalId = this.pollingIntervals.get(animaId);
        if (intervalId) {
            window.clearInterval(intervalId);
            this.pollingIntervals.delete(animaId);
        }
    }

    private notifySubscribers(animaId: string, update: PersonalityUpdate): void {
        this.subscriptions.get(animaId)?.forEach(callback => {
            callback(update);
        });
    }

    public async getInitialState(animaId: string): Promise<PersonalityUpdate> {
        return await this.actor.get_personality_state(animaId);
    }

    public getConnectionMode(): ConnectionMode {
        return this.connectionMode;
    }
}