import { useState, useCallback } from 'react';
import { processPayment, PaymentError } from '../services/payment';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const handlePayment = useCallback(async (principal) => {
    if (!principal) {
      throw new Error('Principal is required');
    }

    setIsProcessing(true);
    setError(null);
    setReceipt(null);

    try {
      const result = await processPayment(principal);
      setReceipt(result.receipt);
      return result;
    } catch (err) {
      const error = err instanceof PaymentError ? err : new PaymentError(
        'Payment processing failed',
        'UNKNOWN_ERROR',
        { originalError: err }
      );
      
      setError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearReceipt = useCallback(() => {
    setReceipt(null);
  }, []);

  return {
    makePayment: handlePayment,
    isProcessing,
    error,
    receipt,
    clearError,
    clearReceipt
  };
};