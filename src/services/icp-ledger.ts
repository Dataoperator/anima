import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';

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

  private constructor(private ledgerActor: ActorSubclass) {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(ledgerActor: ActorSubclass): ICPLedgerService {
    if (!ICPLedgerService.instance) {
      ICPLedgerService.instance = new ICPLedgerService(ledgerActor);
    }
    return ICPLedgerService.instance;
  }

  async transfer(args: {
    to: Principal | string;
    amount: bigint;
    memo?: bigint;
    fee?: bigint;
    fromSubaccount?: number[];
  }): Promise<TransactionResponse> {
    try {
      const transfer: ICPTransfer = {
        amount: { e8s: args.amount },
        fee: { e8s: args.fee || this.DEFAULT_FEE },
        memo: args.memo || BigInt(0),
        from_subaccount: args.fromSubaccount || this.DEFAULT_SUBACCOUNT,
        to: args.to,
        created_at_time: [],
      };

      const result = await this.ledgerActor.transfer(transfer);

      // Handle various response types
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
      this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Transfer failed'),
        ErrorSeverity.HIGH,
        { args }
      );
      throw error;
    }
  }

  async getBalance(principal: Principal): Promise<bigint> {
    try {
      const result = await this.ledgerActor.account_balance({
        account: principal,
      });
      return result.e8s;
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Balance check failed'),
        ErrorSeverity.HIGH,
        { principal: principal.toString() }
      );
      throw error;
    }
  }

  async getTransactions(args: {
    start: bigint;
    length: bigint;
  }): Promise<{
    transactions: Array<{
      timestamp: bigint;
      transfer: ICPTransfer;
      type: 'transfer' | 'mint' | 'burn';
    }>;
  }> {
    try {
      return await this.ledgerActor.get_transactions(args);
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Get transactions failed'),
        ErrorSeverity.HIGH,
        { args }
      );
      throw error;
    }
  }

  formatICP(amount: bigint): string {
    return `${Number(amount) / 100_000_000} ICP`;
  }

  validateTransferAmount(amount: bigint): boolean {
    return amount > 0 && amount < BigInt(Number.MAX_SAFE_INTEGER);
  }

  dispose(): void {
    ICPLedgerService.instance = null;
  }
}