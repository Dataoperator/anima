export enum AlertLevel {
    CRITICAL = 'CRITICAL',
    WARNING = 'WARNING',
    INFO = 'INFO'
}

export enum AlertStatus {
    NEW = 'NEW',
    ACKNOWLEDGED = 'ACKNOWLEDGED',
    RESOLVED = 'RESOLVED',
    IGNORED = 'IGNORED'
}

export interface Alert {
    id: string;
    type: string;
    level: AlertLevel;
    message: string;
    timestamp: number;
    status: AlertStatus;
    meta?: Record<string, any>;
}

export interface AlertHistory {
    alerts: Alert[];
    stats: {
        total: number;
        critical: number;
        warning: number;
        info: number;
        resolved: number;
    };
}

export interface AlertAction {
    type: string;
    payload?: any;
}