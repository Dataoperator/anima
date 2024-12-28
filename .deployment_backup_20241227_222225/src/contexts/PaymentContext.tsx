import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { LedgerCanister } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { useAuth } from './AuthContext';

export enum PaymentType {
    CREATION = 'CREATION',
    GROWTH = 'GROWTH',
    RESURRECTION = 'RESURRECTION',
    CUSTOMIZATION = 'CUSTOMIZATION'
}

export interface PaymentState {
    paymentType: PaymentType | null;
    amount: bigint | null;
    processing: boolean;
    error: string | null;
    balance: bigint | null;
    ledgerService: LedgerCanister | null;
}

export interface PaymentContextType {
    paymentType: PaymentType | null;
    amount: bigint | null;
    processing: boolean;
    error: string | null;
    balance: bigint | null;
    ledgerService: LedgerCanister | null;
    initiatePayment: (type: PaymentType) => Promise<void>;
    processPayment: () => Promise<boolean>;
    resetPayment: () => void;
    refreshBalance: () => Promise<void>;
}

const initialState: PaymentState = {
    paymentType: null,
    amount: null,
    processing: false,
    error: null,
    balance: null,
    ledgerService: null
};

type PaymentAction = 
    | { type: 'SET_PAYMENT_TYPE'; payload: PaymentType }
    | { type: 'SET_AMOUNT'; payload: bigint }
    | { type: 'SET_PROCESSING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_BALANCE'; payload: bigint }
    | { type: 'SET_LEDGER_SERVICE'; payload: LedgerCanister }
    | { type: 'RESET' };

const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
    switch (action.type) {
        case 'SET_PAYMENT_TYPE':
            return { ...state, paymentType: action.payload };
        case 'SET_AMOUNT':
            return { ...state, amount: action.payload };
        case 'SET_PROCESSING':
            return { ...state, processing: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_BALANCE':
            return { ...state, balance: action.payload };
        case 'SET_LEDGER_SERVICE':
            return { ...state, ledgerService: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};

export const PaymentContext = createContext<PaymentContextType | null>(null);

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(paymentReducer, initialState);
    const { actor, principal } = useAuth();

    const getPaymentAmount = (type: PaymentType): bigint => {
        switch (type) {
            case PaymentType.CREATION:
                return BigInt(1_000_000_000); // 1 ICP
            case PaymentType.GROWTH:
                return BigInt(500_000_000); // 0.5 ICP
            case PaymentType.RESURRECTION:
                return BigInt(2_000_000_000); // 2 ICP
            case PaymentType.CUSTOMIZATION:
                return BigInt(100_000_000); // 0.1 ICP
        }
    };

    const refreshBalance = useCallback(async () => {
        if (!state.ledgerService || !principal) return;
        
        try {
            const accountId = AccountIdentifier.fromPrincipal({
                principal: Principal.fromText(principal.toString())
            });
            const balance = await state.ledgerService.accountBalance({
                accountIdentifier: accountId
            });
            dispatch({ type: 'SET_BALANCE', payload: balance.e8s });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
        }
    }, [state.ledgerService, principal]);

    const initiatePayment = async (type: PaymentType) => {
        try {
            if (!actor || !principal) {
                throw new Error('Authentication required');
            }

            dispatch({ type: 'SET_ERROR', payload: null });
            dispatch({ type: 'SET_PAYMENT_TYPE', payload: type });
            dispatch({ type: 'SET_AMOUNT', payload: getPaymentAmount(type) });
            await refreshBalance();
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
        }
    };

    const processPayment = async (): Promise<boolean> => {
        if (!state.ledgerService || !state.amount || !principal || !actor) {
            dispatch({ type: 'SET_ERROR', payload: 'Payment setup incomplete' });
            return false;
        }

        dispatch({ type: 'SET_PROCESSING', payload: true });

        try {
            const canisterPrincipal = Principal.fromText(process.env.CANISTER_ID_ANIMA || '');
            const toAccountId = AccountIdentifier.fromPrincipal({
                principal: canisterPrincipal
            });

            await state.ledgerService.transfer({
                memo: BigInt(Date.now()),
                amount: { e8s: state.amount },
                to: toAccountId,
                fromSubaccount: null,
                createdAt: BigInt(Date.now())
            });

            await refreshBalance();
            dispatch({ type: 'SET_PROCESSING', payload: false });
            return true;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
            dispatch({ type: 'SET_PROCESSING', payload: false });
            return false;
        }
    };

    const resetPayment = () => {
        dispatch({ type: 'RESET' });
    };

    return (
        <PaymentContext.Provider
            value={{
                ...state,
                initiatePayment,
                processPayment,
                resetPayment,
                refreshBalance
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};