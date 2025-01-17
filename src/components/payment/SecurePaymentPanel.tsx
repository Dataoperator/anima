import React, { useCallback, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { useSecurePayment } from '../../hooks/useSecurePayment';
import { Alert, AlertTitle } from '../ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useQuantumState } from '../../hooks/useQuantumState';

interface SecurePaymentPanelProps {
    onPaymentComplete: (tokenId: string) => void;
    onError: (error: string) => void;
}

export const SecurePaymentPanel: React.FC<SecurePaymentPanelProps> = ({
    onPaymentComplete,
    onError
}) => {
    const {
        createPaymentSession,
        verifyPayment,
        currentSession,
        paymentStatus,
        paymentError,
        isLoading,
        resetPayment
    } = useSecurePayment();

    const { quantumState } = useQuantumState();

    const handleStartPayment = useCallback(async () => {
        try {
            if (quantumState.coherenceLevel < 0.3) {
                throw new Error('Quantum coherence too low for transaction');
            }
            await createPaymentSession();
        } catch (error) {
            onError(error instanceof Error ? error.message : 'Failed to start payment');
        }
    }, [createPaymentSession, onError, quantumState]);

    const formatE8s = (e8s: number): string => {
        return `${(e8s / 100_000_000).toFixed(8)} ICP`;
    };

    useEffect(() => {
        if (paymentStatus === 'confirmed' && currentSession?.token_id) {
            onPaymentComplete(currentSession.token_id);
        }
    }, [paymentStatus, currentSession, onPaymentComplete]);

    if (paymentError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Payment Error</AlertTitle>
                <p>{paymentError}</p>
                <Button onClick={resetPayment} variant="outline" className="mt-4">
                    Try Again
                </Button>
            </Alert>
        );
    }

    if (!currentSession) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Start ANIMA Minting</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Cost: 1 ICP</p>
                    <Button 
                        onClick={handleStartPayment} 
                        disabled={isLoading || quantumState.coherenceLevel < 0.3}
                        className="w-full"
                    >
                        {isLoading ? 'Initializing...' : 'Start Payment'}
                    </Button>
                    {quantumState.coherenceLevel < 0.3 && (
                        <p className="text-amber-500 mt-2">
                            Quantum coherence too low. Please wait for stabilization.
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="font-mono text-sm break-all">
                            Payment Address: {currentSession.payment_address}
                        </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span>Amount:</span>
                        <span className="font-bold">{formatE8s(currentSession.amount)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span>Status:</span>
                        <span className={`font-bold ${
                            paymentStatus === 'confirmed' ? 'text-green-500' :
                            paymentStatus === 'expired' ? 'text-red-500' :
                            paymentStatus === 'failed' ? 'text-red-500' :
                            'text-amber-500'
                        }`}>
                            {paymentStatus?.toUpperCase()}
                        </span>
                    </div>

                    {paymentStatus === 'pending' && (
                        <div className="text-sm text-gray-500">
                            <p>Please send exactly {formatE8s(currentSession.amount)} to the address above.</p>
                            <p className="mt-2">The payment session will expire in 1 hour.</p>
                        </div>
                    )}

                    {paymentStatus === 'expired' && (
                        <Button onClick={resetPayment} variant="outline" className="w-full">
                            Start New Session
                        </Button>
                    )}

                    {paymentStatus === 'failed' && (
                        <>
                            <Alert variant="destructive">
                                <AlertTitle>Payment Failed</AlertTitle>
                                <p>Your payment could not be processed. Any sent funds will be refunded.</p>
                            </Alert>
                            <Button onClick={resetPayment} variant="outline" className="w-full">
                                Try Again
                            </Button>
                        </>
                    )}

                    {isLoading && (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};