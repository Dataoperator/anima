import React, { createContext, useContext, useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { PaymentService } from '@/services/icp/payment.service';
import { useAuth } from '@/hooks/useAuth';
import { PaymentType } from '@/types/payment';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';

interface PaymentContextType {
  balance: bigint;
  loading: boolean;
  error: string | null;
  processingPayment: boolean;
  lastTransaction: any | null;
  coherenceLevel: number;
  stabilityIndex: number;
  updateBalance: () => Promise<void>;
  processPayment: (type: PaymentType) => Promise<boolean>;
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
  const { identity } = useAuth();
  const [service, setService] = useState<PaymentService | null>(null);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any | null>(null);
  const [coherenceLevel, setCoherenceLevel] = useState(0);
  const [stabilityIndex, setStabilityIndex] = useState(0);

  useEffect(() => {
    if (identity) {
      const paymentService = PaymentService.getInstance(identity);
      setService(paymentService);
      paymentService.initialize().catch((err) => {
        setError(err.message);
        ErrorTracker.getInstance().trackError(ErrorCategory.PAYMENT, err, ErrorSeverity.HIGH);
      });
    }
  }, [identity]);

  const updateBalance = async () => {
    try {
      setLoading(true);
      if (!service) throw new Error('Payment service not initialized');
      
      const newBalance = service.getBalance();
      setBalance(newBalance);
      
      const metrics = service.getQuantumMetrics();
      setCoherenceLevel(metrics.coherenceLevel);
      setStabilityIndex(metrics.stabilityIndex);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      ErrorTracker.getInstance().trackError(
        ErrorCategory.PAYMENT,
        err instanceof Error ? err : new Error('Balance update failed'),
        ErrorSeverity.MEDIUM
      );
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (type: PaymentType): Promise<boolean> => {
    try {
      setProcessingPayment(true);
      if (!service) throw new Error('Payment service not initialized');

      const payment = await service.createPayment(type);
      const success = await service.processPayment(payment);
      
      if (success) {
        setLastTransaction({ 
          type,
          amount: payment.amount,
          timestamp: Date.now() 
        });
        await updateBalance();
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      ErrorTracker.getInstance().trackError(
        ErrorCategory.PAYMENT,
        err instanceof Error ? err : new Error('Payment processing failed'),
        ErrorSeverity.HIGH
      );
      return false;
    } finally {
      setProcessingPayment(false);
    }
  };

  useEffect(() => {
    if (service) {
      updateBalance();
    }
  }, [service]);

  const value = {
    balance,
    loading,
    error,
    processingPayment,
    lastTransaction,
    coherenceLevel,
    stabilityIndex,
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