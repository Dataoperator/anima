import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '../utils/error-tracker';
import { createLedgerActor } from '../declarations/ledger';

interface ICPTransfer {
  amount: { e8s: bigint };
  fee: { e8s: bigint };
  memo: bigint;
  from_subaccount?: number[];
  to: string | Principal;
  created_at_time?: bigint;
}

interface TransactionResponse {
  height: bigint;
  blockId: string;
}

export class ICPLedgerService {
  private static instance: ICPLedgerService | null = null;
  private errorTracker: ErrorTracker;
  private readonly DEFAULT_FEE = BigInt(10_000);
  private readonly DEFAULT_SUBACCOUNT = [];
  private initialized: boolean = false;
  private actor: ActorSubclass | null = null;

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(): ICPLedgerService {
    if (!ICPLedgerService.instance) {
      ICPLedgerService.instance = new ICPLedgerService();
    }
    return ICPLedgerService.instance;
  }

  async initialize(identity: any): Promise<void> {
    if (this.initialized) return;

    try {
      this.actor = await createLedgerActor(identity);
      // Verify actor connection with a simple call
      await this.actor.icrc1_name();
      this.initialized = true;
      console.log('✅ ICP Ledger Service initialized');
    } catch (error) {
      this.errorTracker.trackError({
        type: 'LedgerInitializationError',
        category: ErrorCategory.Technical,
        severity: ErrorSeverity.High,
        message: 'Failed to initialize ICP ledger',
        timestamp: new Date(),
        context: { error: error instanceof Error ? error.message : String(error) }
      });
      throw error;
    }
  }

  async transfer(args: {
    to: Principal | string;
    amount: bigint;
    memo?: bigint;
    fee?: bigint;
    fromSubaccount?: number[];
  }): Promise<TransactionResponse> {
    if (!this.initialized || !this.actor) {
      throw new Error('ICPLedgerService not initialized');
    }

    try {
      const transfer: ICPTransfer = {
        amount: { e8s: args.amount },
        fee: { e8s: args.fee || this.DEFAULT_FEE },
        memo: args.memo || BigInt(0),
        from_subaccount: args.fromSubaccount || this.DEFAULT_SUBACCOUNT,
        to: args.to,
      };

      const result = await this.actor.transfer(transfer);

      if ('Ok' in result) {
        return {
          height: result.Ok,
          blockId: result.Ok.toString(),
        };
      } else if ('Err' in result) {
        throw new Error(JSON.stringify(result.Err));
      }

      throw new Error('Unknown transfer response format');
    } catch (error) {
      this.errorTracker.trackError({
        type: 'TransferError',
        category: ErrorCategory.PAYMENT,
        severity: ErrorSeverity.HIGH,
        message: error instanceof Error ? error.message : 'Transfer failed',
        timestamp: new Date(),
        context: { args }
      });
      throw error;
    }
  }

  async getBalance(principal: Principal): Promise<bigint> {
    if (!this.initialized || !this.actor) {
      throw new Error('ICPLedgerService not initialized');
    }

    try {
      const result = await this.actor.account_balance({
        account: { owner: principal, subaccount: [] },
      });
      return result.e8s;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'BalanceCheckError',
        category: ErrorCategory.PAYMENT,
        severity: ErrorSeverity.HIGH,
        message: error instanceof Error ? error.message : 'Balance check failed',
        timestamp: new Date(),
        context: { principal: principal.toString() }
      });
      throw error;
    }
  }

  async validateTransaction(blockIndex: bigint): Promise<boolean> {
    if (!this.initialized || !this.actor) {
      throw new Error('ICPLedgerService not initialized');
    }

    try {
      // Get transaction details and verify
      const txn = await this.actor.get_blocks({ start: blockIndex, length: BigInt(1) });
      return txn.blocks.length > 0;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'TransactionValidationError',
        category: ErrorCategory.PAYMENT,
        severity: ErrorSeverity.HIGH,
        message: error instanceof Error ? error.message : 'Transaction validation failed',
        timestamp: new Date(),
        context: { blockIndex: blockIndex.toString() }
      });
      return false;
    }
  }

  formatICP(amount: bigint): string {
    return `${Number(amount) / 100_000_000} ICP`;
  }

  validateTransferAmount(amount: bigint): boolean {
    return amount > 0 && amount < BigInt(Number.MAX_SAFE_INTEGER);
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  dispose(): void {
    this.initialized = false;
    this.actor = null;
    ICPLedgerService.instance = null;
  }
}

export const icpLedgerService = ICPLedgerService.getInstance();