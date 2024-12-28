import { RealtimeMessage, PersonalityUpdate } from '@/types/realtime';

export class WebSocketService {
    private static instance: WebSocketService;
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private subscriptions: Map<string, Set<(data: PersonalityUpdate) => void>>;
    private pendingMessages: RealtimeMessage[] = [];
    private isConnecting = false;

    private constructor() {
        this.subscriptions = new Map();
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public async connect(canisterId: string): Promise<void> {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;

        this.isConnecting = true;
        
        try {
            const wsUrl = this.getWebSocketUrl(canisterId);
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = this.handleOpen.bind(this);
            this.ws.onmessage = this.handleMessage.bind(this);
            this.ws.onclose = this.handleClose.bind(this);
            this.ws.onerror = this.handleError.bind(this);

            await this.waitForConnection();
            this.reconnectAttempts = 0;
            this.isConnecting = false;
        } catch (error) {
            this.isConnecting = false;
            throw error;
        }
    }

    private async waitForConnection(): Promise<void> {
        if (!this.ws) throw new Error('WebSocket not initialized');

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('WebSocket connection timeout'));
            }, 5000);

            this.ws!.addEventListener('open', () => {
                clearTimeout(timeout);
                resolve();
            }, { once: true });

            this.ws!.addEventListener('error', () => {
                clearTimeout(timeout);
                reject(new Error('WebSocket connection failed'));
            }, { once: true });
        });
    }

    public subscribe(animaId: string, callback: (data: PersonalityUpdate) => void): () => void {
        if (!this.subscriptions.has(animaId)) {
            this.subscriptions.set(animaId, new Set());
            this.sendSubscription(animaId);
        }

        this.subscriptions.get(animaId)?.add(callback);

        return () => {
            const subs = this.subscriptions.get(animaId);
            if (subs) {
                subs.delete(callback);
                if (subs.size === 0) {
                    this.sendUnsubscription(animaId);
                    this.subscriptions.delete(animaId);
                }
            }
        };
    }

    private sendSubscription(animaId: string): void {
        const message: RealtimeMessage = {
            type: 'SUBSCRIBE',
            payload: { anima_id: animaId }
        };

        this.sendMessage(message);
    }

    private sendUnsubscription(animaId: string): void {
        const message: RealtimeMessage = {
            type: 'UNSUBSCRIBE',
            payload: { anima_id: animaId }
        };

        this.sendMessage(message);
    }

    private sendMessage(message: RealtimeMessage): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            this.pendingMessages.push(message);
        }
    }

    private handleOpen(): void {
        // Send any pending messages
        while (this.pendingMessages.length > 0) {
            const message = this.pendingMessages.shift();
            if (message) this.sendMessage(message);
        }
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const message = JSON.parse(event.data) as RealtimeMessage;
            if (message.type === 'UPDATE') {
                const update = message.payload as PersonalityUpdate;
                const subs = this.subscriptions.get(update.anima_id);
                subs?.forEach(callback => callback(update));
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    }

    private handleClose(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                this.connect(this.getCurrentCanisterId());
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    private handleError(error: Event): void {
        console.error('WebSocket error:', error);
    }

    private handleOnline(): void {
        this.connect(this.getCurrentCanisterId());
    }

    private handleOffline(): void {
        this.ws?.close();
    }

    private getCurrentCanisterId(): string {
        // Get canister ID from environment or configuration
        return process.env.CANISTER_ID_ANIMA || '';
    }

    private getWebSocketUrl(canisterId: string): string {
        const isLocal = process.env.DFX_NETWORK !== 'ic';
        return isLocal
            ? `ws://localhost:8000/ws/${canisterId}`
            : `wss://${canisterId}.icp0.io/ws`;
    }

    public getConnectionState(): string {
        if (!this.ws) return 'DISCONNECTED';
        
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING: return 'CONNECTING';
            case WebSocket.OPEN: return 'CONNECTED';
            case WebSocket.CLOSING: return 'CLOSING';
            case WebSocket.CLOSED: return 'DISCONNECTED';
            default: return 'UNKNOWN';
        }
    }
}