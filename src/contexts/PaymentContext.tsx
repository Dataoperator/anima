import React, { createContext, useContext, useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';

interface PaymentContextType {
  balance: bigint;
  loading: boolean;
  error: string | null;
  processingPayment: boolean;
  lastTransaction: any | null;
  updateBalance: () => Promise<void>;
  processPayment: (amount: bigint, recipient: Principal) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any | null>(null);

  const updateBalance = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual balance fetch from IC
      // This is a placeholder
      setBalance(BigInt(1000000));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (amount: bigint, recipient: Principal): Promise<boolean> => {
    try {
      setProcessingPayment(true);
      // TODO: Implement actual payment processing
      // This is a placeholder
      const success = true;
      if (success) {
        setLastTransaction({ amount, recipient, timestamp: Date.now() });
        await updateBalance();
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      return false;
    } finally {
      setProcessingPayment(false);
    }
  };

  useEffect(() => {
    updateBalance();
  }, []);

  const value = {
    balance,
    loading,
    error,
    processingPayment,
    lastTransaction,
    updateBalance,
    processPayment,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;