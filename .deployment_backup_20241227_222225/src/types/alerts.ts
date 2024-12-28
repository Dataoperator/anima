export type AlertLevel = 'CRITICAL' | 'WARNING' | 'INFO';

export interface Alert {
    id: string;
    level: AlertLevel;
    message: string;
    timestamp: number;
    details?: string;
    source?: string;
    actions?: string[];
    metadata?: Record<string, any>;
}

export interface AlertFilters {
    level: AlertLevel | null;
    since: Date | null;
    until: Date | null;
}

export interface AlertAction {
    type: string;
    payload: any;
}

export interface AlertCategory {
    id: string;
    name: string;
    description: string;
    level: AlertLevel;
    autoResolve?: boolean;
    resolutionTime?: number;
}

export interface AlertConfig {
    categories: AlertCategory[];
    thresholds: Record<string, number>;
    autoResolveEnabled: boolean;
    notificationSettings: {
        email: boolean;
        slack: boolean;
        webhook?: string;
    };
}

export enum AlertStatus {
    ACTIVE = 'ACTIVE',
    ACKNOWLEDGED = 'ACKNOWLEDGED',
    RESOLVED = 'RESOLVED',
    IGNORED = 'IGNORED'
}

export interface AlertStats {
    total: number;
    active: number;
    resolved: number;
    byLevel: Record<AlertLevel, number>;
    byCategory: Record<string, number>;
}

export interface AlertHistory {
    alertId: string;
    status: AlertStatus;
    timestamp: number;
    action?: string;
    actor?: string;
    notes?: string;
}