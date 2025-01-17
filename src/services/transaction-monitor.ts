import { Principal } from '@dfinity/principal';
import { EventEmitter } from 'events';
import { LedgerService } from './icp/ledger';
import { ErrorTracker } from '@/error/quantum_error';
import { SystemMonitor } from '@/analytics/SystemHealthMonitor';

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RECOVERY = 'RECOVERY'
}

export interface Transaction {
  id: string;
  from: Principal;
  to: Principal;
  amount: bigint;
  status: TransactionStatus;
  timestamp: number;
  retryCount: number;
  verificationAttempts: number;
  metadata?: Record<string, any>;
}

interface TransactionUpdate {
  txId: string;
  status: TransactionStatus;
  error?: Error;
}

export class TransactionMonitor extends EventEmitter {
  private static instance: TransactionMonitor;
  private transactions: Map<string, Transaction>;
  private ledgerService: LedgerService;
  private errorTracker: ErrorTracker;
  private systemMonitor: SystemMonitor;
  private readonly MAX_RETRIES = 3;
  private readonly VERIFICATION_INTERVAL = 5000; // 5 seconds
  private readonly MAX_VERIFICATION_ATTEMPTS = 5;

  private constructor(
    ledgerService: LedgerService,
    errorTracker: ErrorTracker,
    systemMonitor: SystemMonitor
  ) {
    super();
    this.transactions = new Map();
    this.ledgerService = ledgerService;
    this.errorTracker = errorTracker;
    this.systemMonitor = systemMonitor;
  }

  static getInstance(
    ledgerService: LedgerService,
    errorTracker: ErrorTracker,
    systemMonitor: SystemMonitor
  ): TransactionMonitor {
    if (!TransactionMonitor.instance) {
      TransactionMonitor.instance = new TransactionMonitor(
        ledgerService,
        errorTracker,
        systemMonitor
      );
    }
    return TransactionMonitor.instance;
  }

  async trackTransaction(
    from: Principal,
    to: Principal,
    amount: bigint,
    metadata?: Record<string, any>
  ): Promise<string> {
    const txId = this.generateTransactionId();
    
    const transaction: Transaction = {
      id: txId,
      from,
      to,
      amount,
      status: TransactionStatus.PENDING,
      timestamp: Date.now(),
      retryCount: 0,
      verificationAttempts: 0,
      metadata
    };

    this.transactions.set(txId, transaction);
    
    await this.systemMonitor.recordMetric({
      type: 'transaction_initiated',
      value: Number(amount),
      context: {
        txId,
        from: from.toText(),
        to: to.toText()
      }
    });

    this.emit('transactionCreated', transaction);
    return txId;
  }

  async processTransaction(txId: string): Promise<void> {
    const transaction = this.transactions.get(txId);
    if (!transaction) throw new Error(`Transaction ${txId} not found`);

    try {
      this.updateTransactionStatus(txId, TransactionStatus.PROCESSING);

      const result = await this.ledgerService.transfer({
        to: transaction.to,
        amount: transaction.amount
      });

      if (result.txId) {
        transaction.metadata = {
          ...transaction.metadata,
          ledgerTxId: result.txId
        };
        
        this.updateTransactionStatus(txId, TransactionStatus.VERIFYING);
        this.startVerification(txId);
      }

    } catch (error) {
      await this.handleTransactionError(txId, error as Error);
    }
  }

  private async startVerification(txId: string): Promise<void> {
    const verify = async () => {
      const transaction = this.transactions.get(txId);
      if (!transaction) return;

      if (transaction.status === TransactionStatus.COMPLETED ||
          transaction.status === TransactionStatus.FAILED) {
        return;
      }

      try {
        const isVerified = await this.ledgerService.verifyTransaction(
          transaction.metadata?.ledgerTxId
        );

        if (isVerified) {
          this.updateTransactionStatus(txId, TransactionStatus.COMPLETED);
          return;
        }

        transaction.verificationAttempts++;
        
        if (transaction.verificationAttempts >= this.MAX_VERIFICATION_ATTEMPTS) {
          await this.handleTransactionError(
            txId,
            new Error('Max verification attempts reached')
          );
          return;
        }

        setTimeout(() => verify(), this.VERIFICATION_INTERVAL);

      } catch (error) {
        await this.handleTransactionError(txId, error as Error);
      }
    };

    verify();
  }

  private async handleTransactionError(txId: string, error: Error): Promise<void> {
    const transaction = this.transactions.get(txId);
    if (!transaction) return;

    await this.errorTracker.trackError({
      errorType: 'TRANSACTION_ERROR',
      severity: 'HIGH',
      context: 'transaction_monitor',
      error,
      metadata: {
        txId,
        status: transaction.status,
        retryCount: transaction.retryCount
      }
    });

    if (transaction.retryCount < this.MAX_RETRIES) {
      transaction.retryCount++;
      this.updateTransactionStatus(txId, TransactionStatus.RECOVERY);
      await this.processTransaction(txId);
    } else {
      this.updateTransactionStatus(txId, TransactionStatus.FAILED);
    }
  }

  private updateTransactionStatus(txId: string, status: TransactionStatus): void {
    const transaction = this.transactions.get(txId);
    if (!transaction) return;

    transaction.status = status;
    this.transactions.set(txId, transaction);

    const update: TransactionUpdate = {
      txId,
      status
    };

    this.emit('transactionUpdated', update);
  }

  getTransaction(txId: string): Transaction | undefined {
    return this.transactions.get(txId);
  }

  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  getPendingTransactions(): Transaction[] {
    return Array.from(this.transactions.values()).filter(
      tx => tx.status === TransactionStatus.PENDING ||
           tx.status === TransactionStatus.PROCESSING ||
           tx.status === TransactionStatus.VERIFYING
    );
  }

  getFailedTransactions(): Transaction[] {
    return Array.from(this.transactions.values()).filter(
      tx => tx.status === TransactionStatus.FAILED
    );
  }

  async recoverTransaction(txId: string): Promise<void> {
    const transaction = this.transactions.get(txId);
    if (!transaction) throw new Error(`Transaction ${txId} not found`);

    if (transaction.status !== TransactionStatus.FAILED) {
      throw new Error(`Transaction ${txId} is not in a failed state`);
    }

    transaction.retryCount = 0;
    transaction.verificationAttempts = 0;
    this.updateTransactionStatus(txId, TransactionStatus.PENDING);
    await this.processTransaction(txId);
  }

  async cleanupCompletedTransactions(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();
    for (const [txId, transaction] of this.transactions.entries()) {
      if (transaction.status === TransactionStatus.COMPLETED &&
          now - transaction.timestamp > maxAge) {
        this.transactions.delete(txId);
      }
    }
  }

  private generateTransactionId(): string {
    return `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Analytics and Monitoring Methods
  async getTransactionMetrics(): Promise<{
    totalTransactions: number;
    pendingCount: number;
    failedCount: number;
    completedCount: number;
    averageProcessingTime: number;
  }> {
    const transactions = this.getAllTransactions();
    const completed = transactions.filter(tx => tx.status === TransactionStatus.COMPLETED);
    
    const averageProcessingTime = completed.reduce((sum, tx) => {
      const processingTime = tx.timestamp - Date.now();
      return sum + processingTime;
    }, 0) / (completed.length || 1);

    return {
      totalTransactions: transactions.length,
      pendingCount: this.getPendingTransactions().length,
      failedCount: this.getFailedTransactions().length,
      completedCount: completed.length,
      averageProcessingTime
    };
  }

  // Event listeners for external monitoring
  onTransactionCreated(callback: (transaction: Transaction) => void): void {
    this.on('transactionCreated', callback);
  }

  onTransactionUpdated(callback: (update: TransactionUpdate) => void): void {
    this.on('transactionUpdated', callback);
  }

  onTransactionCompleted(callback: (transaction: Transaction) => void): void {
    this.on('transactionUpdated', (update: TransactionUpdate) => {
      if (update.status === TransactionStatus.COMPLETED) {
        const transaction = this.getTransaction(update.txId);
        if (transaction) callback(transaction);
      }
    });
  }

  onTransactionFailed(callback: (transaction: Transaction, error?: Error) => void): void {
    this.on('transactionUpdated', (update: TransactionUpdate) => {
      if (update.status === TransactionStatus.FAILED) {
        const transaction = this.getTransaction(update.txId);
        if (transaction) callback(transaction, update.error);
      }
    });
  }
}