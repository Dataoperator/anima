import { ActorSubclass, Agent, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { sha256 } from '@dfinity/principal/lib/cjs/utils/sha256';
import { getCrc32 } from '@dfinity/principal/lib/cjs/utils/getCrc';
import { AccountIdentifier, SubAccount, TransferError, TransferResult, TransferArgs, LedgerActor } from '@/types/ledger';

const ICP_DECIMALS = 8;
const E8S_PER_ICP = BigInt(10 ** ICP_DECIMALS);
const MEMO_CREATE_ANIMA = BigInt(1);
const MEMO_GROW_ANIMA = BigInt(2);
const MEMO_RESURRECT_ANIMA = BigInt(3);

interface TransactionRecord {
    blockIndex: bigint;
    amount: bigint;
    memo: bigint;
    timestamp: bigint;
    status: 'pending' | 'confirmed' | 'failed';
    error?: string;
}

export class LedgerService {
    private static instance: LedgerService;
    private actor: LedgerActor | null = null;
    private agent: Agent | null = null;
    private transactions: Map<string, TransactionRecord> = new Map();
    private pendingConfirmations: Map<string, NodeJS.Timeout> = new Map();
    private readonly confirmationTimeout = 60000; // 1 minute
    
    private constructor() {
        this.loadTransactionHistory();
    }

    public static getInstance(): LedgerService {
        if (!LedgerService.instance) {
            LedgerService.instance = new LedgerService();
        }
        return LedgerService.instance;
    }

    public async initialize(identity: any): Promise<void> {
        this.agent = new HttpAgent({
            host: 'https://ic0.app',
            identity
        });

        const canisterId = process.env.LEDGER_CANISTER_ID;
        if (!canisterId) {
            throw new Error('Ledger canister ID not configured');
        }

        try {
            await this.agent.fetchRootKey();
            this.actor = await this.createLedgerActor(canisterId, this.agent);
        } catch (error) {
            console.error('Failed to initialize ledger:', error);
            throw new Error('Ledger initialization failed');
        }
    }

    public getAccountIdentifier(owner: Principal, subaccount?: number[]): string {
        const acc = this.getAccountIdentifierBytes(owner, subaccount);
        return this.toHexString(acc);
    }

    private getAccountIdentifierBytes(owner: Principal, subaccount?: number[]): Uint8Array {
        const ownerBytes = owner.toUint8Array();
        const subaccountBytes = subaccount ? new Uint8Array(subaccount) : new Uint8Array(32);
        
        const hash = sha256([
            new Uint8Array([0x0a]),
            new TextEncoder().encode('account-id'),
            ownerBytes,
            subaccountBytes
        ]);

        const checksum = getCrc32(hash);
        const bytes = new Uint8Array(hash.length + 4);
        bytes.set(checksum, 0);
        bytes.set(hash, 4);
        
        return bytes;
    }

    private toHexString(bytes: Uint8Array): string {
        return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    public async transfer(args: TransferArgs): Promise<TransferResult> {
        if (!this.actor) {
            throw new Error('Ledger not initialized');
        }

        const transactionId = this.generateTransactionId(args);

        try {
            // Convert ICP tokens to e8s
            const e8sAmount = args.amount;
            const fee = args.fee || BigInt(10000); // Default fee in e8s

            const result = await this.actor.icrc1_transfer({
                to: args.to,
                amount: e8sAmount,
                fee,
                memo: args.memo || BigInt(0),
                from_subaccount: args.from_subaccount,
                created_at_time: args.created_at_time || BigInt(Date.now() * 1000000)
            });

            if ('Ok' in result) {
                this.recordTransaction({
                    blockIndex: result.Ok,
                    amount: e8sAmount,
                    memo: args.memo || BigInt(0),
                    timestamp: BigInt(Date.now()),
                    status: 'pending'
                }, transactionId);

                this.waitForConfirmation(transactionId, result.Ok);
                return result;
            } else {
                this.recordTransaction({
                    blockIndex: BigInt(0),
                    amount: e8sAmount,
                    memo: args.memo || BigInt(0),
                    timestamp: BigInt(Date.now()),
                    status: 'failed',
                    error: this.getTransferErrorMessage(result.Err)
                }, transactionId);
                return result;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.recordTransaction({
                blockIndex: BigInt(0),
                amount: args.amount,
                memo: args.memo || BigInt(0),
                timestamp: BigInt(Date.now()),
                status: 'failed',
                error: errorMessage
            }, transactionId);
            throw error;
        }
    }

    public async getBalance(account: AccountIdentifier): Promise<bigint> {
        if (!this.actor) {
            throw new Error('Ledger not initialized');
        }

        try {
            const result = await this.actor.icrc1_balance_of({ 
                owner: Principal.fromText(account),
                subaccount: [] 
            });
            return result;
        } catch (error) {
            console.error('Failed to get balance:', error);
            throw error;
        }
    }

    public async getTransaction(blockIndex: bigint): Promise<TransactionRecord | null> {
        const transactionId = Array.from(this.transactions.entries())
            .find(([_, record]) => record.blockIndex === blockIndex)?.[0];

        if (transactionId) {
            return this.transactions.get(transactionId) || null;
        }

        return null;
    }

    public async getPendingTransactions(): Promise<TransactionRecord[]> {
        return Array.from(this.transactions.values())
            .filter(tx => tx.status === 'pending');
    }

    public isInitialized(): boolean {
        return this.actor !== null;
    }

    private async createLedgerActor(canisterId: string, agent: Agent): Promise<LedgerActor> {
        const { idlFactory } = await import('@dfinity/ledger-icp');
        return await ActorSubclass.createActor<LedgerActor>(idlFactory, {
            agent,
            canisterId: Principal.fromText(canisterId)
        });
    }

    private generateTransactionId(args: TransferArgs): string {
        const data = [
            args.to,
            args.amount.toString(),
            args.memo?.toString() || '0',
            Date.now().toString()
        ].join('-');
        
        return sha256(new TextEncoder().encode(data))
            .slice(0, 16)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    private recordTransaction(record: TransactionRecord, id: string): void {
        this.transactions.set(id, record);
        this.saveTransactionHistory();
    }

    private async waitForConfirmation(transactionId: string, blockIndex: bigint): Promise<void> {
        const timeout = setTimeout(async () => {
            const transaction = this.transactions.get(transactionId);
            if (transaction?.status === 'pending') {
                try {
                    const block = await this.actor?.icrc1_transfer_from(blockIndex);
                    if (block) {
                        this.confirmTransaction(transactionId);
                    } else {
                        this.failTransaction(transactionId, 'Transaction timeout');
                    }
                } catch (error) {
                    this.failTransaction(transactionId, 'Failed to confirm transaction');
                }
            }
            this.pendingConfirmations.delete(transactionId);
        }, this.confirmationTimeout);

        this.pendingConfirmations.set(transactionId, timeout);
    }

    private confirmTransaction(transactionId: string): void {
        const transaction = this.transactions.get(transactionId);
        if (transaction) {
            transaction.status = 'confirmed';
            this.saveTransactionHistory();
        }
    }

    private failTransaction(transactionId: string, error: string): void {
        const transaction = this.transactions.get(transactionId);
        if (transaction) {
            transaction.status = 'failed';
            transaction.error = error;
            this.saveTransactionHistory();
        }
    }

    private getTransferErrorMessage(error: TransferError): string {
        if ('BadFee' in error) {
            return `Incorrect fee, expected: ${error.BadFee.expected_fee}`;
        } else if ('InsufficientFunds' in error) {
            return `Insufficient funds, balance: ${error.InsufficientFunds.balance}`;
        } else if ('TooOld' in error) {
            return 'Transaction too old';
        } else if ('CreatedInFuture' in error) {
            return 'Transaction created in future';
        } else if ('TemporarilyUnavailable' in error) {
            return 'Service temporarily unavailable';
        } else if ('Duplicate' in error) {
            return `Duplicate of block ${error.Duplicate.duplicate_of}`;
        }
        return 'Unknown transfer error';
    }

    private saveTransactionHistory(): void {
        try {
            const history = Array.from(this.transactions.entries())
                .map(([id, record]) => ({
                    id,
                    ...record,
                    blockIndex: record.blockIndex.toString(),
                    amount: record.amount.toString(),
                    memo: record.memo.toString(),
                    timestamp: record.timestamp.toString()
                }));

            localStorage.setItem('ledger_transactions', JSON.stringify(history));
        } catch (error) {
            console.error('Failed to save transaction history:', error);
        }
    }

    private loadTransactionHistory(): void {
        try {
            const history = localStorage.getItem('ledger_transactions');
            if (history) {
                const parsed = JSON.parse(history);
                this.transactions = new Map(
                    parsed.map((record: any) => [
                        record.id,
                        {
                            ...record,
                            blockIndex: BigInt(record.blockIndex),
                            amount: BigInt(record.amount),
                            memo: BigInt(record.memo),
                            timestamp: BigInt(record.timestamp)
                        }
                    ])
                );
            }
        } catch (error) {
            console.error('Failed to load transaction history:', error);
        }
    }

    public destroy(): void {
        this.pendingConfirmations.forEach(timeout => clearTimeout(timeout));
        this.pendingConfirmations.clear();
        this.transactions.clear();
        this.actor = null;
        this.agent = null;
    }
}