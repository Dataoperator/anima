import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import { PaymentSession, PaymentStatus } from '../declarations/payment_verification/payment_verification.did';
import { useAuth } from './useAuth';
import { useActor } from './useActor';
import { ErrorTracker, ErrorCategory } from '../services/error-tracker';

export interface UseSecurePaymentResult {
    createPaymentSession: () => Promise<PaymentSession>;
    verifyPayment: (sessionId: string) => Promise<boolean>;
    currentSession: PaymentSession | null;
    paymentStatus: PaymentStatus | null;
    paymentError: string | null;
    isLoading: boolean;
    resetPayment: () => void;
}

export const useSecurePayment = () => {
    const { identity } = useAuth();
    const { actor: paymentActor } = useActor('payment_verification');
    const [currentSession, setCurrentSession] = useState<PaymentSession | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const errorTracker = ErrorTracker.getInstance();

    const createPaymentSession = useCallback(async (): Promise<PaymentSession> => {
        try {
            setIsLoading(true);
            setPaymentError(null);

            if (!identity) {
                throw new Error('User not authenticated');
            }

            const session = await paymentActor.create_payment_session(identity.getPrincipal());
            
            if ('Err' in session) {
                throw new Error(session.Err);
            }

            setCurrentSession(session.Ok);
            setPaymentStatus(session.Ok.status);
            return session.Ok;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create payment session';
            setPaymentError(errorMessage);
            errorTracker.trackError(ErrorCategory.PAYMENT, error as Error, {
                context: 'createPaymentSession',
                identity: identity?.getPrincipal().toString()
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [identity, paymentActor]);

    const verifyPayment = useCallback(async (sessionId: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const status = await paymentActor.check_payment_status(sessionId);
            
            if ('Ok' in status) {
                setPaymentStatus(status.Ok);
                return status.Ok === 'confirmed';
            }
            
            throw new Error(status.Err);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
            setPaymentError(errorMessage);
            errorTracker.trackError(ErrorCategory.PAYMENT, error as Error, {
                context: 'verifyPayment',
                sessionId
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [paymentActor]);

    const resetPayment = useCallback(() => {
        setCurrentSession(null);
        setPaymentStatus(null);
        setPaymentError(null);
        setIsLoading(false);
    }, []);

    // Auto-check payment status
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        if (currentSession?.status === 'pending') {
            intervalId = setInterval(() => {
                verifyPayment(currentSession.session_id);
            }, 5000); // Check every 5 seconds
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [currentSession, verifyPayment]);

    return {
        createPaymentSession,
        verifyPayment,
        currentSession,
        paymentStatus,
        paymentError,
        isLoading,
        resetPayment
    };
};