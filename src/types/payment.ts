export enum PaymentType {
    Creation = 'Creation',
    Growth = 'Growth',
    Resurrection = 'Resurrection',
    Upgrade = 'Upgrade'
}

export interface PaymentTransaction {
    id: string;
    type: PaymentType;
    amount: bigint;
    status: 'Pending' | 'Complete' | 'Failed';
    timestamp: number;
    retryCount?: number;
    error?: string;
}

export interface PaymentMetrics {
    totalTransactions: number;
    successRate: number;
    averageAmount: bigint;
    failureRate: number;
}