import React, { createContext, useContext, useState, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import type { ActorSubclass } from '@dfinity/agent';
import { _SERVICE } from '@/declarations/anima/anima.did';
import { useAuth } from './auth-context';
import { LedgerService } from '@/services/ledger';
import { PaymentContextType, PaymentType } from '@/types/payment';

const PaymentContext = createContext<PaymentContextType | null>(null);

interface PaymentProviderProps {
    children: React.ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
    const { actor } = useAuth();
    const [balance, setBalance] = useState<bigint | null>(null);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [paymentInProgress, setPaymentInProgress] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [ledger, setLedger] = useState<LedgerService>();

    const refreshBalance = useCallback(async () => {
        if (!actor || !ledger) return;
        setLoadingBalance(true);
        try {
            const accountId = await ledger.getAccountIdentifier(
                await actor.get_principal()
            );
            const currentBalance = await ledger.getBalance(accountId);
            setBalance(currentBalance);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            setPaymentError('Failed to fetch balance');
        } finally {
            setLoadingBalance(false);
        }
    }, [actor, ledger]);

    const initiatePayment = useCallback(async (type: PaymentType): Promise<boolean> => {
        if (!actor || !ledger) {
            setPaymentError('Payment service not initialized');
            return false;
        }

        setPaymentInProgress(true);
        setPaymentError(null);

        try {
            // Get payment amount for the selected type
            const paymentType = { [type]: null };
            const paymentAmount = await actor.get_payment_amount(paymentType);
            
            if ('Err' in paymentAmount) {
                throw new Error(paymentAmount.Err);
            }

            const amount = paymentAmount.Ok;

            // Transfer tokens
            const result = await actor.process_payment(paymentType);
            
            if ('Err' in result) {
                throw new Error(result.Err);
            }

            await refreshBalance();
            return true;
        } catch (error) {
            console.error('Payment failed:', error);
            setPaymentError(error instanceof Error ? error.message : 'Payment failed');
            return false;
        } finally {
            setPaymentInProgress(false);
        }
    }, [actor, ledger, refreshBalance]);

    const verifyPayment = useCallback(async (blockIndex: bigint): Promise<boolean> => {
        if (!actor) {
            setPaymentError('Not authenticated');
            return false;
        }

        try {
            const result = await actor.verify_payment(blockIndex);
            return 'Ok' in result;
        } catch (error) {
            console.error('Payment verification failed:', error);
            setPaymentError('Payment verification failed');
            return false;
        }
    }, [actor]);

    const value: PaymentContextType = {
        balance,
        loadingBalance,
        initiatePayment,
        verifyPayment,
        paymentInProgress,
        paymentError,
        ledgerService: ledger
    };

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = (): PaymentContextType => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};