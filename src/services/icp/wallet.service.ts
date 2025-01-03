import { Identity, Principal } from '@dfinity/principal';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';
import { hash } from '@dfinity/principal/lib/cjs/utils/sha224';
import { Actor } from '@dfinity/agent';
import { idlFactory } from '../../declarations/ledger.did';

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'spend';
  amount: bigint;
  timestamp: number;
  memo?: string;
  status: 'pending' | 'completed' | 'failed';
  quantumState?: {
    coherence: number;
    stability: number;
    entanglement: number;
  };
}

export interface WalletState {
  balance: bigint;
  transactions: WalletTransaction[];
  address: string;
  isLocked: boolean;
  quantumMetrics: {
    coherenceLevel: number;
    stabilityIndex: number;
    entanglementFactor: number;
    lastSync: number;
  };
  backupState?: {
    lastBackup: number;
    backupHash: string;
  };
}

export class WalletService {
  private static instance: WalletService | null = null;
  private initialized: boolean = false;
  private state: WalletState | null = null;
  private identity: Identity;
  private errorTracker: ErrorTracker;
  private syncInterval: NodeJS.Timeout | null = null;
  
  private constructor(identity: Identity) {
    this.identity = identity;
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(identity: Identity): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService(identity);
    }
    return WalletService.instance;
  }

  private async generateWalletAddress(principal: Principal): Promise<string> {
    const sha224 = hash();
    sha224.update(Buffer.from('\x0Awallet-id'));
    sha224.update(principal.toUint8Array());
    const addressBytes = new Uint8Array(sha224.digest());
    return Buffer.from(addressBytes).toString('hex');
  }

  private calculateQuantumMetrics(): void {
    if (!this.state) return;

    const now = Date.now();
    const recentTransactions = this.state.transactions
      .filter(t => now - t.timestamp < 24 * 60 * 60 * 1000); // Last 24 hours

    this.state.quantumMetrics = {
      coherenceLevel: this.calculateCoherence(recentTransactions),
      stabilityIndex: this.calculateStability(recentTransactions),
      entanglementFactor: this.calculateEntanglement(),
      lastSync: now
    };
  }

  private calculateCoherence(transactions: WalletTransaction[]): number {
    if (!transactions.length) return 1.0;
    const successRate = transactions.filter(t => t.status === 'completed').length / transactions.length;
    return Math.max(0.1, Math.min(1.0, successRate * 1.2));
  }

  private calculateStability(transactions: WalletTransaction[]): number {
    if (!transactions.length) return 1.0;
    const volatility = transactions.reduce((sum, t) => sum + Number(t.amount), 0) / transactions.length;
    return Math.max(0.1, Math.min(1.0, 1 - (volatility / Number(this.state?.balance || 1))));
  }

  private calculateEntanglement(): number {
    return Math.random() * 0.5 + 0.5; // Placeholder for quantum entanglement calculation
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const principal = this.identity.getPrincipal();
      const address = await this.generateWalletAddress(principal);

      this.state = {
        balance: BigInt(0),
        transactions: [],
        address,
        isLocked: false,
        quantumMetrics: {
          coherenceLevel: 1.0,
          stabilityIndex: 1.0,
          entanglementFactor: 1.0,
          lastSync: Date.now()
        }
      };

      await this.refreshBalance();
      await this.loadTransactionHistory();
      await this.startQuantumSync();

      this.initialized = true;
      console.log('✅ Wallet service initialized with quantum enhancement');
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.WALLET,
        error instanceof Error ? error : new Error('Wallet initialization failed'),
        ErrorSeverity.CRITICAL,
        { identity: this.identity.getPrincipal().toString() }
      );
      throw error;
    }
  }

  private async startQuantumSync(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.calculateQuantumMetrics();
      this.backupStateIfNeeded();
    }, 60000); // Sync every minute
  }

  private async backupStateIfNeeded(): Promise<void> {
    if (!this.state) return;

    const now = Date.now();
    if (!this.state.backupState || now - this.state.backupState.lastBackup > 3600000) {
      const stateHash = await this.generateStateHash();
      this.state.backupState = {
        lastBackup: now,
        backupHash: stateHash
      };
    }
  }

  private async generateStateHash(): Promise<string> {
    if (!this.state) return '';
    const sha224 = hash();
    sha224.update(Buffer.from(JSON.stringify({
      balance: this.state.balance.toString(),
      address: this.state.address,
      quantumMetrics: this.state.quantumMetrics
    })));
    return Buffer.from(sha224.digest()).toString('hex');
  }

  async refreshBalance(): Promise<bigint> {
    if (!this.state) throw new Error('Wallet not initialized');

    try {
      const ledgerActor = await Actor.createActor(idlFactory, {
        agent: this.identity,
        canisterId: process.env.LEDGER_CANISTER_ID
      });

      const balance = await ledgerActor.account_balance({
        account: Array.from(Buffer.from(this.state.address, 'hex'))
      });

      this.state.balance = balance.e8s;
      this.calculateQuantumMetrics();
      return this.state.balance;
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.WALLET,
        error instanceof Error ? error : new Error('Balance refresh failed'),
        ErrorSeverity.HIGH
      );
      throw error;
    }
  }

  async deposit(amount: bigint): Promise<WalletTransaction> {
    if (!this.state) throw new Error('Wallet not initialized');
    if (this.state.isLocked) throw new Error('Wallet is locked');
    if (this.state.quantumMetrics.coherenceLevel < 0.3) throw new Error('Wallet coherence too low');

    const transaction: WalletTransaction = {
      id: crypto.randomUUID(),
      type: 'deposit',
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
        to: Array.from(Buffer.from(this.state.address, 'hex')),
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
      this.errorTracker.trackError(
        ErrorCategory.WALLET,
        error instanceof Error ? error : new Error('Deposit failed'),
        ErrorSeverity.HIGH,
        { amount: amount.toString() }
      );
      throw error;
    }
  }

  async withdraw(amount: bigint, toAddress: string): Promise<WalletTransaction> {
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
      this.errorTracker.trackError(
        ErrorCategory.WALLET,
        error instanceof Error ? error : new Error('Withdrawal failed'),
        ErrorSeverity.HIGH,
        { amount: amount.toString(), toAddress }
      );
      throw error;
    }
  }

  async spend(amount: bigint, memo: string): Promise<WalletTransaction> {
    if (!this.state) throw new Error('Wallet not initialized');
    if (this.state.isLocked) throw new Error('Wallet is locked');
    if (amount > this.state.balance) throw new Error('Insufficient balance');

    const transaction: WalletTransaction = {
      id: crypto.randomUUID(),
      type: 'spend',
      amount,
      timestamp: Date.now(),
      memo,
      status: 'pending',
      quantumState: {
        coherence: this.state.quantumMetrics.coherenceLevel,
        stability: this.state.quantumMetrics.stabilityIndex,
        entanglement: this.state.quantumMetrics.entanglementFactor
      }
    };

    try {
      this.state.transactions.unshift(transaction);
      this.state.balance -= amount;
      transaction.status = 'completed';
      this.calculateQuantumMetrics();
      return transaction;
    } catch (error) {
      transaction.status = 'failed';
      this.errorTracker.trackError(
        ErrorCategory.WALLET,
        error instanceof Error ? error : new Error('Spend failed'),
        ErrorSeverity.HIGH,
        { amount: amount.toString(), memo }
      );
      throw error;
    }
  }

  async loadTransactionHistory(): Promise<WalletTransaction[]> {
    if (!this.state) throw new Error('Wallet not initialized');

    try {
      return this.state.transactions;
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.WALLET,
        error instanceof Error ? error : new Error('Transaction history fetch failed'),
        ErrorSeverity.MEDIUM
      );
      throw error;
    }
  }

  getBalance(): bigint {
    if (!this.state) throw new Error('Wallet not initialized');
    return this.state.balance;
  }

  getAddress(): string {
    if (!this.state) throw new Error('Wallet not initialized');
    return this.state.address;
  }

  getQuantumMetrics() {
    if (!this.state) throw new Error('Wallet not initialized');
    return this.state.quantumMetrics;
  }

  lock(): void {
    if (!this.state) throw new Error('Wallet not initialized');
    this.state.isLocked = true;
  }

  unlock(): void {
    if (!this.state) throw new Error('Wallet not initialized');
    this.state.isLocked = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  dispose(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    WalletService.instance = null;
  }
}