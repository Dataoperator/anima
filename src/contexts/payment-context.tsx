import React, { createContext, useContext, useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useAuth } from './auth-context';
import { icpLedgerService } from '../services/icp-ledger.service';
import { ErrorTracker } from '../utils/error-tracker';

interface PaymentContextType {
  balance: bigint | null;
  isLoading: boolean;
  refreshBalance: () => Promise<void>;
  makePayment: (args: {
    to: Principal | string;
    amount: bigint;
    memo?: bigint;
  }) => Promise<{ blockIndex: bigint }>;
  formatICP: (amount: bigint) => string;
  validateAmount: (amount: bigint) => boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { identity, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    if (isAuthenticated && identity) {
      initializePayments();
    }
  }, [isAuthenticated, identity]);

  const initializePayments = async () => {
    if (!identity) return;
    
    try {
      await icpLedgerService.initialize(identity);
      await refreshBalance();
    } catch (error) {
      console.error('Failed to initialize payments:', error);
      errorTracker.trackError({
        type: 'PaymentInitializationError',
        category: 'PAYMENT',
        severity: 'HIGH',
        message: 'Failed to initialize payment system',
        timestamp: new Date(),
        context: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  };

  const refreshBalance = async () => {
    if (!identity) return;

    setIsLoading(true);
    try {
      const principal = identity.getPrincipal();
      const newBalance = await icpLedgerService.getBalance(principal);
      setBalance(newBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      errorTracker.trackError({
        type: 'BalanceUpdateError',
        category: 'PAYMENT',
        severity: 'MEDIUM',
        message: 'Failed to update balance',
        timestamp: new Date(),
        context: { error: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const makePayment = async ({
    to,
    amount,
    memo = BigInt(0)
  }: {
    to: Principal | string;
    amount: bigint;
    memo?: bigint;
  }) => {
    if (!identity) {
      throw new Error('Not authenticated');
    }

    try {
      const result = await icpLedgerService.transfer({
        to,
        amount,
        memo
      });

      // Verify transaction
      const isValid = await icpLedgerService.validateTransaction(result.height);
      if (!isValid) {
        throw new Error('Transaction validation failed');
      }

      // Update balance after successful payment
      await refreshBalance();

      return { blockIndex: result.height };
    } catch (error) {
      console.error('Payment failed:', error);
      errorTracker.trackError({
        type: 'PaymentError',
        category: 'PAYMENT',
        severity: 'HIGH',
        message: 'Payment failed',
        timestamp: new Date(),
        context: {
          to: typeof to === 'string' ? to : to.toString(),
          amount: amount.toString(),
          error: error instanceof Error ? error.message : String(error)
        }
      });
      throw error;
    }
  };

  const value = {
    balance,
    isLoading,
    refreshBalance,
    makePayment,
    formatICP: icpLedgerService.formatICP,
    validateAmount: icpLedgerService.validateTransferAmount
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};