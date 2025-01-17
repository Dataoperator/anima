import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import { useAuth } from './auth-context';
import { ActorSubclass } from '@dfinity/agent';

interface WalletState {
  balance: bigint;
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
}

interface WalletContextType {
  balance: bigint;
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { identity, isAuthenticated } = useAuth();
  const [state, setState] = useState<WalletState>({
    balance: BigInt(0),
    address: null,
    isConnected: false,
    isLoading: true
  });

  const connect = useCallback(async () => {
    if (!identity) return;

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const principal = identity.getPrincipal();
      const address = principal.toText();

      // Initial balance fetch
      const initialBalance = BigInt(0); // Replace with actual ledger query
      
      setState({
        balance: initialBalance,
        address,
        isConnected: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [identity]);

  const disconnect = useCallback(() => {
    setState({
      balance: BigInt(0),
      address: null,
      isConnected: false,
      isLoading: false
    });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!state.address || !identity) return;

    try {
      // Implement actual balance fetch from IC ledger
      const newBalance = BigInt(0); // Replace with actual ledger query
      setState(prev => ({ ...prev, balance: newBalance }));
    } catch (error) {
      console.error('Balance refresh failed:', error);
    }
  }, [state.address, identity]);

  useEffect(() => {
    if (isAuthenticated && identity) {
      connect();
    } else {
      disconnect();
    }
  }, [isAuthenticated, identity, connect, disconnect]);

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
        refreshBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};