import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context'; // Fixed import path
import { Principal } from '@dfinity/principal';

const PAYMENT_AMOUNTS = {
  Creation: BigInt(100_000_000), // 1 ICP
  Evolution: BigInt(50_000_000),  // 0.5 ICP
  Feature: BigInt(25_000_000),   // 0.25 ICP
};

export const usePayment = () => {
  const { actor, principal } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPaymentAmount = useCallback((type: keyof typeof PAYMENT_AMOUNTS) => {
    return PAYMENT_AMOUNTS[type];
  }, []);

  const processPayment = useCallback(async (
    amount: bigint,
    paymentType: keyof typeof PAYMENT_AMOUNTS
  ) => {
    if (!actor || !principal) {
      throw new Error('Not authenticated');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const principalId = Principal.fromText(principal);
      const result = await actor.process_payment({
        amount,
        payer: principalId,
        payment_type: paymentType,
        timestamp: BigInt(Date.now())
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [actor, principal]);

  return {
    processPayment,
    getPaymentAmount,
    isProcessing,
    error,
  };
};

export type PaymentHook = ReturnType<typeof usePayment>;