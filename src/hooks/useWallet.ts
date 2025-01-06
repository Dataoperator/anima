import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { walletService, WalletState } from '@/services/wallet.service';
import { transactionHistoryService, Transaction } from '@/services/transaction-history.service';

interface ExtendedWalletState extends WalletState {
  transactions: Transaction[];
}

export function useWallet() {
  const { identity, isAuthenticated } = useAuth();
  const [walletState, setWalletState] = useState<ExtendedWalletState>({
    ...walletService.getState(),
    transactions: []
  });
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize wallet and transaction history
  const initializeWallet = useCallback(async () => {
    if (!identity || !isAuthenticated) return;

    try {
      setIsInitializing(true);
      setError(null);
      
      await walletService.initialize(identity);
      
      // Start transaction polling
      transactionHistoryService.startPolling(identity);
      
      // Update wallet state
      setWalletState({
        ...walletService.getState(),
        transactions: transactionHistoryService.getTransactions()
      });
    } catch (err) {
      console.error('Failed to initialize wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize wallet');
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [identity, isAuthenticated]);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!identity || !isAuthenticated) return;

    try {
      setError(null);
      await walletService.refreshBalance(identity);
      setWalletState({
        ...walletService.getState(),
        transactions: transactionHistoryService.getTransactions()
      });
    } catch (err) {
      console.error('Failed to refresh balance:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh balance');
      throw err;
    }
  }, [identity, isAuthenticated]);

  // Subscribe to wallet updates
  useEffect(() => {
    if (!isAuthenticated || !identity) return;

    const unsubscribeWallet = walletService.subscribe((state) => {
      setWalletState(prev => ({
        ...state,
        transactions: prev.transactions
      }));
    });

    const unsubscribeTransactions = transactionHistoryService.subscribe((transactions) => {
      setWalletState(prev => ({
        ...prev,
        transactions
      }));
    });

    return () => {
      unsubscribeWallet();
      unsubscribeTransactions();
      transactionHistoryService.stopPolling();
    };
  }, [isAuthenticated, identity]);

  // Initialize wallet when authenticated
  useEffect(() => {
    if (isAuthenticated && identity && !walletService.isInitialized()) {
      initializeWallet().catch(console.error);
    }
  }, [isAuthenticated, identity]);

  // Execute transaction
  const executeTransaction = useCallback(async (
    amount: bigint,
    operation: 'mint' | 'transfer' | 'burn'
  ) => {
    if (!identity || !isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      setError(null);
      const transaction = await walletService.executeTransaction(identity, amount, operation);
      await refreshBalance();
      return transaction;
    } catch (err) {
      console.error('Transaction failed:', err);
      setError(err instanceof Error ? err.message : 'Transaction failed');
      throw err;
    }
  }, [identity, isAuthenticated, refreshBalance]);

  return {
    wallet: walletState,
    isInitializing,
    error,
    executeTransaction,
    initializeWallet,
    refreshBalance
  };
}