import type { 
    RealtimeConnection,
    RealtimeMessage, 
    WebSocketState,
    SubscriptionOptions,
    RealtimeEventHandler,
    UpdateMode,
    WebSocketError
} from '@/types/realtime';
import { UpdateType } from '@/types/realtime';

const DEFAULT_OPTIONS: Required<SubscriptionOptions> = {
    includeQuantumState: true,
    includeEmotionalState: true,
    includeConsciousness: true,
    includeDimensions: true,
    updateInterval: 2000,
    mode: 'polling',
    retryAttempts: 5,
    retryDelay: 1000
};

export class RealtimeService implements RealtimeConnection {
    private ws: WebSocket | null = null;
    private eventHandlers: Set<RealtimeEventHandler> = new Set();
    private state: WebSocketState = {
        connected: false,
        error: null,
        reconnectAttempts: 0,
        lastUpdate: null,
        mode: 'polling'
    };
    private subscriptions: Map<string, Required<SubscriptionOptions>> = new Map();
    private reconnectTimeout: NodeJS.Timeout | null = null;

    constructor(private readonly endpoint: string) {}

    public async connect(): Promise<void> {
        if (this.ws?.readyState === WebSocket.OPEN) return;

        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.endpoint);

                this.ws.onopen = () => {
                    this.updateState({
                        connected: true,
                        error: null,
                        reconnectAttempts: 0
                    });
                    this.notifyHandlers({
                        type: UpdateType.CONNECTED,
                        payload: { 
                            anima_id: '',
                            message: 'Connected to realtime service' 
                        },
                        timestamp: BigInt(Date.now())
                    });
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message: RealtimeMessage = JSON.parse(event.data);
                        this.handleMessage(message);
                    } catch (err) {
                        console.error('Failed to parse message:', err);
                    }
                };

                this.ws.onclose = () => {
                    this.handleDisconnect();
                };

                this.ws.onerror = (error) => {
                    const wsError: WebSocketError = {
                        code: 1006,
                        message: 'WebSocket error occurred',
                        details: { originalError: error }
                    };
                    this.updateState({ error: wsError });
                    reject(wsError);
                };
            } catch (err) {
                const error: WebSocketError = {
                    code: 1006,
                    message: 'Failed to establish connection',
                    details: { originalError: err }
                };
                this.updateState({ error });
                reject(error);
            }
        });
    }

    public disconnect(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.updateState({
            connected: false,
            error: null,
            reconnectAttempts: 0,
            lastUpdate: null
        });
    }

    public async subscribe(animaId: string, options?: SubscriptionOptions): Promise<void> {
        const fullOptions = { ...DEFAULT_OPTIONS, ...options };
        this.subscriptions.set(animaId, fullOptions);

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            await this.connect();
        }

        const message: RealtimeMessage = {
            type: UpdateType.SUBSCRIBE,
            payload: {
                anima_id: animaId,
                message: 'Subscribing to updates'
            },
            timestamp: BigInt(Date.now())
        };

        this.ws?.send(JSON.stringify(message));
    }

    public async unsubscribe(animaId: string): Promise<void> {
        this.subscriptions.delete(animaId);

        if (this.ws?.readyState === WebSocket.OPEN) {
            const message: RealtimeMessage = {
                type: UpdateType.UNSUBSCRIBE,
                payload: {
                    anima_id: animaId,
                    message: 'Unsubscribing from updates'
                },
                timestamp: BigInt(Date.now())
            };

            this.ws.send(JSON.stringify(message));
        }

        if (this.subscriptions.size === 0) {
            this.disconnect();
        }
    }

    public isConnected(): boolean {
        return this.state.connected;
    }

    public getState(): WebSocketState {
        return this.state;
    }

    public addEventListener(handler: RealtimeEventHandler): void {
        this.eventHandlers.add(handler);
    }

    public removeEventListener(handler: RealtimeEventHandler): void {
        this.eventHandlers.delete(handler);
    }

    private updateState(newState: Partial<WebSocketState>): void {
        this.state = { ...this.state, ...newState };
    }

    private notifyHandlers(message: RealtimeMessage): void {
        this.eventHandlers.forEach(handler => {
            try {
                handler(message);
            } catch (err) {
                console.error('Error in event handler:', err);
            }
        });
    }

    private handleMessage(message: RealtimeMessage): void {
        this.updateState({ lastUpdate: message.timestamp });
        
        if (message.type === UpdateType.ERROR) {
            const error = message.payload as WebSocketError;
            this.updateState({ error });
        }
        
        this.notifyHandlers(message);
    }

    private handleDisconnect(): void {
        this.updateState({ connected: false });
        
        const message: RealtimeMessage = {
            type: UpdateType.DISCONNECTED,
            payload: {
                anima_id: '',
                message: 'Disconnected from realtime service'
            },
            timestamp: BigInt(Date.now())
        };
        
        this.notifyHandlers(message);

        // Attempt to reconnect if we have subscriptions
        if (this.subscriptions.size > 0 && 
            this.state.reconnectAttempts < DEFAULT_OPTIONS.retryAttempts) {
            this.reconnectTimeout = setTimeout(() => {
                this.updateState({ 
                    reconnectAttempts: this.state.reconnectAttempts + 1 
                });
                this.connect().catch(err => {
                    console.error('Reconnection attempt failed:', err);
                });
            }, DEFAULT_OPTIONS.retryDelay * Math.pow(2, this.state.reconnectAttempts));
        }
    }

    private getPollingInterval(animaId: string): number {
        const options = this.subscriptions.get(animaId);
        return options?.updateInterval || DEFAULT_OPTIONS.updateInterval;
    }

    private getUpdateMode(animaId: string): UpdateMode {
        const options = this.subscriptions.get(animaId);
        return options?.mode || DEFAULT_OPTIONS.mode;
    }
}