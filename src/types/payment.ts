import { Principal } from '@dfinity/principal';
import type { LedgerService } from '@/services/icp/actor';
import type { PaymentDetails } from '@/contexts/PaymentContext';
import { PaymentType, PaymentStatus } from './payment-enums';

export { PaymentType, PaymentStatus };

export interface PaymentLink {
  id: string;
  amount: bigint;
  to: string;
  from: string;
  subaccount: number[];
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface PaymentVerification {
  payment_id: string;
  expected_amount: bigint;
  timestamp?: number;
  memo?: bigint;
}

export interface PaymentError {
  code: number;
  message: string;
  details?: unknown;
  timestamp?: number;
}

export interface TransactionRecord {
  from: Principal;
  to: Principal;
  amount: bigint;
  timestamp: number;
  memo: bigint;
  status: PaymentStatus;
  error?: PaymentError;
}

export interface PaymentState {
  isProcessing: boolean;
  error: PaymentError | null;
  lastTransaction?: TransactionRecord;
  pendingTransactions: TransactionRecord[];
}

export interface PaymentContextType {
  balance: bigint | null;
  loadingBalance: boolean;
  initiatePayment: (type: PaymentType) => Promise<PaymentDetails>;
  verifyPayment: (reference: string) => Promise<boolean>;
  paymentInProgress: boolean;
  paymentError: string | null;
  currentPayment: PaymentDetails | null;
  clearPayment: () => void;
  ledgerService?: LedgerService;
}

export const PAYMENT_CONFIGS = {
  [PaymentType.CREATE]: {
    amount: BigInt(1_00_000_000), // 1 ICP
    memo: BigInt(1),
    description: 'Create New ANIMA'
  },
  [PaymentType.RESURRECT]: {
    amount: BigInt(50_000_000), // 0.5 ICP
    memo: BigInt(2),
    description: 'Resurrect ANIMA'
  },
  [PaymentType.GROWTH_PACK]: {
    amount: BigInt(20_000_000), // 0.2 ICP
    memo: BigInt(3),
    description: 'Purchase Growth Pack'
  }
} as const;