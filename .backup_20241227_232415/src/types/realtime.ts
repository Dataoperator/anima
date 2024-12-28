import type { PersonalityState } from './personality';

export type UpdateMode = 'realtime' | 'polling' | 'autonomous';

export enum UpdateType {
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
    UPDATE = 'UPDATE',
    ERROR = 'ERROR',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED'
}

export interface PersonalityUpdate extends PersonalityState {
    anima_id: string;
    interaction_count: number;
}

export interface WebSocketError {
    code: number;
    message: string;
    details?: Record<string, unknown>;
}

export interface RealtimeMessage {
    type: UpdateType;
    payload: PersonalityUpdate | WebSocketError | {
        anima_id: string;
        message: string;
    };
    timestamp: bigint;
}

export interface WebSocketState {
    connected: boolean;
    error: WebSocketError | null;
    reconnectAttempts: number;
    lastUpdate: bigint | null;
    mode: UpdateMode;
}

export interface SubscriptionOptions {
    includeQuantumState?: boolean;
    includeEmotionalState?: boolean;
    includeConsciousness?: boolean;
    includeDimensions?: boolean;
    updateInterval?: number;
    mode?: UpdateMode;
    retryAttempts?: number;
    retryDelay?: number;
}

export interface RealtimeConnection {
    connect(): Promise<void>;
    disconnect(): void;
    subscribe(animaId: string, options?: SubscriptionOptions): Promise<void>;
    unsubscribe(animaId: string): Promise<void>;
    isConnected(): boolean;
    getState(): WebSocketState;
}

export type RealtimeEventHandler = (message: RealtimeMessage) => void;

export interface RealtimeHookState {
    personality: PersonalityState | null;
    loading: boolean;
    error: WebSocketError | null;
    connectionMode: UpdateMode;
}