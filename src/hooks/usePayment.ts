import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Principal } from '@dfinity/principal';

interface PaymentResult {
  height: bigint;
  transactionId: string;
}

interface PaymentVerification {
  verified: boolean;
  timestamp: bigint;
  status: 'pending' | 'confirmed' | 'failed';
}

interface PaymentParams {
  amount: bigint;
  memo?: bigint;
  toCanister: Principal;
}

const PAYMENT_AMOUNTS = {
  Genesis: BigInt(100_000_000), // 1 ICP
  Evolution: BigInt(50_000_000), // 0.5 ICP
  Feature: BigInt(25_000_000),  // 0.25 ICP
  Quantum: BigInt(75_000_000),  // 0.75 ICP
};

const VERIFICATION_RETRIES = 3;
const VERIFICATION_INTERVAL = 2000; // 2 seconds

export const usePayment = () => {
  const { actor, principal } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<PaymentResult | null>(null);

  const getBalance = useCallback(async (): Promise<bigint> => {
    if (!actor || !principal) {
      throw new Error('Not authenticated');
    }

    try {
      const balance = await actor.icrc1_balance_of({
        owner: Principal.fromText(principal),
        subaccount: [],
      });
      return balance;
    } catch (err) {
      console.error('Balance check failed:', err);
      throw new Error('Failed to fetch balance');
    }
  }, [actor, principal]);

  const initiatePayment = useCallback(async ({
    amount,
    memo = BigInt(Date.now()),
    toCanister
  }: PaymentParams): Promise<PaymentResult> => {
    if (!actor || !principal) {
      throw new Error('Not authenticated');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const balance = await getBalance();
      if (balance < amount) {
        throw new Error('Insufficient balance');
      }

      const result = await actor.icrc2_transfer({
        amount,
        to: { owner: toCanister, subaccount: [] },
        fee: [], // Let the ledger decide the fee
        memo: [memo],
        from_subaccount: [],
        created_at_time: [BigInt(Date.now())],
      });

      if ('Err' in result) {
        throw new Error(JSON.stringify(result.Err));
      }

      const payment: PaymentResult = {
        height: result.Ok,
        transactionId: result.Ok.toString(),
      };

      setLastTransaction(payment);
      return payment;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [actor, principal, getBalance]);

  const verifyPayment = useCallback(async (height: bigint): Promise<PaymentVerification> => {
    if (!actor) {
      throw new Error('Not authenticated');
    }

    let retries = VERIFICATION_RETRIES;
    
    while (retries > 0) {
      try {
        const result = await actor.verify_payment(height);
        
        if ('Ok' in result) {
          return {
            verified: true,
            timestamp: result.Ok.timestamp,
            status: 'confirmed'
          };
        }

        if (retries === 1) {
          return {
            verified: false,
            timestamp: BigInt(Date.now()),
            status: 'failed'
          };
        }

        await new Promise(resolve => setTimeout(resolve, VERIFICATION_INTERVAL));
        retries--;
        
      } catch (err) {
        if (retries === 1) {
          throw new Error('Payment verification failed');
        }
        await new Promise(resolve => setTimeout(resolve, VERIFICATION_INTERVAL));
        retries--;
      }
    }

    return {
      verified: false,
      timestamp: BigInt(Date.now()),
      status: 'failed'
    };
  }, [actor]);

  const getPaymentAmount = useCallback((type: keyof typeof PAYMENT_AMOUNTS) => {
    return PAYMENT_AMOUNTS[type];
  }, []);

  const getTransactionStatus = useCallback(async (transactionId: string) => {
    if (!actor) {
      throw new Error('Not authenticated');
    }

    try {
      const status = await actor.get_transaction_status(transactionId);
      return status;
    } catch (err) {
      console.error('Failed to get transaction status:', err);
      throw new Error('Transaction status check failed');
    }
  }, [actor]);

  return {
    initiatePayment,
    verifyPayment,
    getBalance,
    getPaymentAmount,
    getTransactionStatus,
    isProcessing,
    error,
    lastTransaction,
  };
};

export type PaymentHook = ReturnType<typeof usePayment>;