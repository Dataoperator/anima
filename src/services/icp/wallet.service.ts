import { Actor } from '@dfinity/agent';
import { idlFactory } from './ledger.did';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '../error-tracker';

export type WalletQuantumMetrics = {
    coherenceLevel: number;
    stabilityIndex: number;
    entanglementFactor: number;
    stabilityStatus: 'stable' | 'unstable' | 'critical';
};

export type WalletTransaction = {
    id: string;
    type: 'withdrawal' | 'spend' | 'mint';
    amount: bigint;
    timestamp: number;
    status: 'pending' | 'completed' | 'failed';
    memo?: string;
    quantumMetrics: WalletQuantumMetrics;
    retryCount: number;
};

// Make sure to export the class
export class WalletService {
    private static instance: WalletService | null = null;
    private initialized = false;
    private syncInterval: NodeJS.Timeout | null = null;
    private retryInterval: NodeJS.Timeout | null = null;
    private errorTracker: ErrorTracker;
    private readonly MAX_RETRIES = 3;
    private readonly RETRY_INTERVAL = 30000; // 30 seconds
    private readonly STABILITY_THRESHOLD = 0.7;

    private state: {
        address: string;
        balance: bigint;
        isLocked: boolean;
        transactions: WalletTransaction[];
        quantumMetrics: WalletQuantumMetrics;
        pendingTransactions: Map<string, WalletTransaction>;
    } | null = null;

    private constructor() {
        this.errorTracker = ErrorTracker.getInstance();
        this.setupRetryMechanism();
    }

    public static getInstance(): WalletService {
        if (!WalletService.instance) {
            WalletService.instance = new WalletService();
        }
        return WalletService.instance;
    }

    private setupRetryMechanism(): void {
        this.retryInterval = setInterval(() => {
            this.retryFailedTransactions();
        }, this.RETRY_INTERVAL);
    }

    private async retryFailedTransactions(): Promise<void> {
        if (!this.state) return;

        for (const [id, tx] of this.state.pendingTransactions.entries()) {
            if (tx.status === 'failed' && tx.retryCount < this.MAX_RETRIES) {
                try {
                    await this.processTransaction(tx);
                    tx.retryCount++;
                } catch (error) {
                    this.logTransactionError(tx, error);
                }
            } else if (tx.retryCount >= this.MAX_RETRIES) {
                this.state.pendingTransactions.delete(id);
                this.errorTracker.trackError({
                    type: 'MaxRetriesExceeded',
                    category: ErrorCategory.Network,
                    severity: ErrorSeverity.High,
                    message: `Transaction ${id} exceeded max retries`,
                    timestamp: new Date(),
                    context: { transaction: tx }
                });
            }
        }
    }

    private async processTransaction(tx: WalletTransaction): Promise<void> {
        if (!this.state) throw new Error('Wallet not initialized');

        const ledgerActor = await Actor.createActor(idlFactory, {
            agent: window.ic?.agent,
            canisterId: process.env.LEDGER_CANISTER_ID
        });

        try {
            await ledgerActor.transfer({
                to: Array.from(Buffer.from(tx.id, 'hex')),
                amount: { e8s: tx.amount },
                fee: { e8s: BigInt(10000) },
                memo: BigInt(0),
                from_subaccount: [],
                created_at_time: []
            });

            tx.status = 'completed';
            await this.updateTransactionState(tx);
        } catch (error) {
            throw error;
        }
    }

    private async updateTransactionState(tx: WalletTransaction): Promise<void> {
        if (!this.state) return;

        const txIndex = this.state.transactions.findIndex(t => t.id === tx.id);
        if (txIndex !== -1) {
            this.state.transactions[txIndex] = tx;
        }

        if (tx.status === 'completed') {
            this.state.pendingTransactions.delete(tx.id);
        } else {
            this.state.pendingTransactions.set(tx.id, tx);
        }

        await this.updateQuantumMetrics();
    }

    private async updateQuantumMetrics(): Promise<void> {
        if (!this.state) return;

        const recentTransactions = this.state.transactions.slice(-10);
        const successRate = recentTransactions.filter(tx => tx.status === 'completed').length / recentTransactions.length;

        this.state.quantumMetrics = {
            coherenceLevel: Math.max(0.1, Math.min(1.0, this.state.quantumMetrics.coherenceLevel * (1 + (successRate - 0.5)))),
            stabilityIndex: successRate,
            entanglementFactor: Math.min(1.0, this.state.quantumMetrics.entanglementFactor + 0.1),
            stabilityStatus: this.getStabilityStatus(successRate)
        };
    }

    private getStabilityStatus(stabilityIndex: number): 'stable' | 'unstable' | 'critical' {
        if (stabilityIndex >= this.STABILITY_THRESHOLD) return 'stable';
        if (stabilityIndex >= this.STABILITY_THRESHOLD / 2) return 'unstable';
        return 'critical';
    }

    public async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            this.state = {
                address: await this.generateAddress(),
                balance: BigInt(0),
                isLocked: false,
                transactions: [],
                quantumMetrics: {
                    coherenceLevel: 1.0,
                    stabilityIndex: 1.0,
                    entanglementFactor: 0.0,
                    stabilityStatus: 'stable'
                },
                pendingTransactions: new Map()
            };

            await this.refreshBalance();
            this.startSync();
            this.initialized = true;
        } catch (error) {
            this.errorTracker.trackError({
                type: 'InitializationFailed',
                category: ErrorCategory.System,
                severity: ErrorSeverity.Critical,
                message: error instanceof Error ? error.message : 'Wallet initialization failed',
                timestamp: new Date()
            });
            throw error;
        }
    }

    private async generateAddress(): Promise<string> {
        return "sample_address"; // Placeholder
    }

    private startSync(): void {
        if (this.syncInterval) return;
        
        this.syncInterval = setInterval(async () => {
            try {
                await this.refreshBalance();
                await this.updateQuantumMetrics();
            } catch (error) {
                console.error('Sync failed:', error);
            }
        }, 30000);
    }

    public async spend(amount: bigint, memo: string = ''): Promise<WalletTransaction> {
        if (!this.state) throw new Error('Wallet not initialized');
        if (this.state.isLocked) throw new Error('Wallet is locked');
        if (amount > this.state.balance) throw new Error('Insufficient balance');
        if (this.state.quantumMetrics.stabilityStatus === 'critical') {
            throw new Error('Wallet stability critical');
        }

        const transaction: WalletTransaction = {
            id: crypto.randomUUID(),
            type: 'spend',
            amount,
            timestamp: Date.now(),
            status: 'pending',
            memo,
            quantumMetrics: this.state.quantumMetrics,
            retryCount: 0
        };

        try {
            this.state.transactions.unshift(transaction);
            this.state.pendingTransactions.set(transaction.id, transaction);
            await this.processTransaction(transaction);
            return transaction;
        } catch (error) {
            this.logTransactionError(transaction, error);
            throw error;
        }
    }

    private logTransactionError(transaction: WalletTransaction, error: unknown): void {
        transaction.status = 'failed';
        this.errorTracker.trackError({
            type: 'TransactionFailed',
            category: ErrorCategory.Network,
            severity: ErrorSeverity.High,
            message: error instanceof Error ? error.message : 'Transaction failed',
            timestamp: new Date(),
            context: { transaction }
        });
    }

    public getBalance(): bigint {
        if (!this.state) throw new Error('Wallet not initialized');
        return this.state.balance;
    }

    public getQuantumMetrics(): WalletQuantumMetrics {
        if (!this.state) throw new Error('Wallet not initialized');
        return this.state.quantumMetrics;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public dispose(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        if (this.retryInterval) {
            clearInterval(this.retryInterval);
        }
        WalletService.instance = null;
    }

    private async refreshBalance(): Promise<void> {
        if (!this.state) throw new Error('Wallet not initialized');
        // Implementation for balance refresh
        // this.state.balance = updated balance from ledger
    }
}