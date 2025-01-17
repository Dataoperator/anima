import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { QuantumState, ResonancePattern } from '@/types/quantum';
import { ErrorTracker } from '@/error/quantum_error';
import { quantumStateService } from '@/services/quantum-state.service';
import { useToast } from '@/components/ui/use-toast';

interface QuantumTransactionState {
  quantumState: QuantumState | null;
  isProcessing: boolean;
  lastError: Error | null;
  activeTransactions: string[];
}

type QuantumAction =
  | { type: 'START_TRANSACTION'; payload: string }
  | { type: 'END_TRANSACTION'; payload: string }
  | { type: 'UPDATE_STATE'; payload: QuantumState }
  | { type: 'SET_ERROR'; payload: Error }
  | { type: 'CLEAR_ERROR' };

const initialState: QuantumTransactionState = {
  quantumState: null,
  isProcessing: false,
  lastError: null,
  activeTransactions: []
};

const QuantumTransactionContext = createContext<{
  state: QuantumTransactionState;
  updateQuantumState: (newState: Partial<QuantumState>) => Promise<void>;
  startTransaction: (id: string) => void;
  endTransaction: (id: string) => void;
  handleError: (error: Error) => void;
} | null>(null);

const quantumReducer = (state: QuantumTransactionState, action: QuantumAction): QuantumTransactionState => {
  switch (action.type) {
    case 'START_TRANSACTION':
      return {
        ...state,
        isProcessing: true,
        activeTransactions: [...state.activeTransactions, action.payload]
      };
    case 'END_TRANSACTION':
      return {
        ...state,
        isProcessing: state.activeTransactions.length <= 1,
        activeTransactions: state.activeTransactions.filter(id => id !== action.payload)
      };
    case 'UPDATE_STATE':
      return {
        ...state,
        quantumState: action.payload,
        lastError: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        lastError: action.payload,
        isProcessing: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        lastError: null
      };
    default:
      return state;
  }
};

export const QuantumTransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quantumReducer, initialState);
  const { toast } = useToast();

  const updateQuantumState = useCallback(async (newState: Partial<QuantumState>) => {
    try {
      const currentState = state.quantumState;
      if (!currentState) throw new Error('No quantum state initialized');

      const updatedState = await quantumStateService.updateState({
        ...currentState,
        ...newState
      });

      dispatch({ type: 'UPDATE_STATE', payload: updatedState });
    } catch (error) {
      handleError(error as Error);
    }
  }, [state.quantumState]);

  const startTransaction = useCallback((id: string) => {
    dispatch({ type: 'START_TRANSACTION', payload: id });
  }, []);

  const endTransaction = useCallback((id: string) => {
    dispatch({ type: 'END_TRANSACTION', payload: id });
  }, []);

  const handleError = useCallback((error: Error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    toast({
      title: 'Quantum Error',
      description: error.message,
      variant: 'destructive',
      duration: 5000
    });
  }, [toast]);

  return (
    <QuantumTransactionContext.Provider
      value={{
        state,
        updateQuantumState,
        startTransaction,
        endTransaction,
        handleError
      }}
    >
      {children}
    </QuantumTransactionContext.Provider>
  );
};

export const useQuantumTransaction = () => {
  const context = useContext(QuantumTransactionContext);
  if (!context) {
    throw new Error('useQuantumTransaction must be used within a QuantumTransactionProvider');
  }
  return context;
};