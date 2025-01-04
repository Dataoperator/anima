import { Actor } from '@dfinity/agent';
import { idlFactory } from './ledger.did';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '../error-tracker';

export type QuantumMetrics = {
    coherenceLevel: number;
    stabilityIndex: number;
    entanglementFactor: number;
};

export type WalletTransaction = {
    id: string;
    type: 'withdrawal' | 'spend';
    amount: bigint;
    timestamp: number;
    status: 'pending' | 'completed' | 'failed';
    memo?: string;
    quantumState: {
        coherence: number;
        stability: number;
        entanglement: number;
    };
};

export class WalletService {
    private static _instance: WalletService | null = null;
    private initialized = false;
    private syncInterval: NodeJS.Timeout | null = null;
    private errorTracker: ErrorTracker;
    private state: {
        address: string;
        balance: bigint;
        isLocked: boolean;
        transactions: WalletTransaction[];
        quantumMetrics: QuantumMetrics;
    } | null = null;
    private identity: any;

    private constructor() {
        this.errorTracker = ErrorTracker.getInstance();
    }

    public static getInstance(): WalletService {
        if (!WalletService._instance) {
            WalletService._instance = new WalletService();
        }
        return WalletService._instance;
    }

    public async initialize(identity?: any): Promise<void> {
        if (this.initialized) return;

        try {
            this.identity = identity;
            this.state = {
                address: await this.generateAddress(identity),
                balance: BigInt(0),
                isLocked: false,
                transactions: [],
                quantumMetrics: {
                    coherenceLevel: 1.0,
                    stabilityIndex: 1.0,
                    entanglementFactor: 0.0
                }
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

    private startSync(): void {
        if (this.syncInterval) return;
        
        this.syncInterval = setInterval(async () => {
            try {
                await this.refreshBalance();
                this.calculateQuantumMetrics();
            } catch (error) {
                console.error('Sync failed:', error);
            }
        }, 30000);
    }

    private calculateQuantumMetrics(): void {
        if (!this.state) return;

        const metrics = this.state.quantumMetrics;
        const txCount = this.state.transactions.length;
        
        metrics.coherenceLevel = Math.max(0.1, Math.min(1.0, 
            metrics.coherenceLevel * (1 + (txCount ? 0.01 : -0.01))
        ));

        const recentTx = this.state.transactions.slice(0, 10);
        const successRate = recentTx.length ? 
            recentTx.filter(tx => tx.status === 'completed').length / recentTx.length : 
            1;
        metrics.stabilityIndex = Math.max(0.1, Math.min(1.0, 
            metrics.stabilityIndex * (0.9 + successRate * 0.1)
        ));

        const complexityFactor = this.state.transactions.reduce((acc, tx) => 
            acc + (tx.type === 'withdrawal' ? 0.1 : 0.05), 0);
        metrics.entanglementFactor = Math.min(1.0, complexityFactor);
    }

    private async generateAddress(identity: any): Promise<string> {
        return "sample_address";
    }

    private async refreshBalance(): Promise<void> {
        if (!this.state) throw new Error('Wallet not initialized');
    }

    public async withdraw(amount: bigint, toAddress: string): Promise<WalletTransaction> {
        if (!this.state) throw new Error('Wallet not initialized');
        if (this.state.isLocked) throw new Error('Wallet is locked');
        if (amount > this.state.balance) throw new Error('Insufficient balance');
        if (this.state.quantumMetrics.stabilityIndex < 0.3) throw new Error('Wallet stability too low');

        const transaction: WalletTransaction = {
            id: crypto.randomUUID(),
            type: 'withdrawal',
            amount,
            timestamp: Date.now(),
            status: 'pending',
            quantumState: {
                coherence: this.state.quantumMetrics.coherenceLevel,
                stability: this.state.quantumMetrics.stabilityIndex,
                entanglement: this.state.quantumMetrics.entanglementFactor
            }
        };

        try {
            this.state.transactions.unshift(transaction);
            
            const ledgerActor = await Actor.createActor(idlFactory, {
                agent: this.identity,
                canisterId: process.env.LEDGER_CANISTER_ID
            });

            await ledgerActor.transfer({
                to: Array.from(Buffer.from(toAddress, 'hex')),
                amount: { e8s: amount },
                fee: { e8s: BigInt(10000) },
                memo: BigInt(0),
                from_subaccount: [],
                created_at_time: []
            });

            transaction.status = 'completed';
            await this.refreshBalance();
            this.calculateQuantumMetrics();

            return transaction;
        } catch (error) {
            transaction.status = 'failed';
            this.errorTracker.trackError({
                type: 'WithdrawalFailed',
                category: ErrorCategory.Network,
                severity: ErrorSeverity.High,
                message: error instanceof Error ? error.message : 'Withdrawal failed',
                timestamp: new Date(),
                context: { amount: amount.toString(), toAddress }
            });
            throw error;
        }
    }

    public getBalance(): bigint {
        if (!this.state) throw new Error('Wallet not initialized');
        return this.state.balance;
    }

    public getQuantumMetrics(): QuantumMetrics {
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
        WalletService._instance = null;
    }
}