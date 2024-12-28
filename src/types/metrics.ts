export type HealthStatus = 'healthy' | 'degraded' | 'critical';

export interface SystemStats {
    uptime: bigint;
    memory_usage: number;
    cycles: bigint;
    canister_count: number;
}

export interface HealthStatusData {
    status: HealthStatus;
    message: string;
    timestamp: bigint;
}

export interface HistoryDataPoint {
    timestamp: bigint;
    value: number;
}

export interface CanisterMetrics {
    cycles: bigint;
    memory_size: bigint;
    heap_memory: bigint;
    stable_memory: bigint;
}

export interface SystemMetrics {
    total_transactions: bigint;
    active_entities: bigint;
    memory_usage: number;
    uptime: bigint;
}

export interface Alert {
    id: string;
    type: 'system' | 'security' | 'performance';
    severity: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: bigint;
    resolved?: boolean;
    resolvedBy?: Principal;
}

export interface AlertAction {
    type: 'acknowledge' | 'resolve' | 'escalate';
    alertId: string;
    metadata?: Record<string, any>;
}