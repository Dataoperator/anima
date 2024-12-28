import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentType } from '@/types/payment';
import { AlertDialog, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert';

interface PaymentComponentProps {
    type: PaymentType;
    'data-testid'?: string;
}

export const PaymentComponent: React.FC<PaymentComponentProps> = ({ type, 'data-testid': testId }) => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { identity } = useAuth();

    const handlePayment = async () => {
        try {
            setStatus('processing');
            // Payment logic will be implemented here
            setStatus('success');
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
        }
    };

    return (
        <div className="w-full max-w-md p-4 space-y-4" data-testid={testId}>
            <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-semibold">
                    {type === PaymentType.Creation ? 'Create Anima' : 'Growth Pack'}
                </h3>
                {status === 'idle' && (
                    <button
                        onClick={handlePayment}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Make Payment
                    </button>
                )}
                {status === 'processing' && (
                    <div className="flex items-center space-x-2">
                        <span className="animate-spin">⟳</span>
                        <span>Processing...</span>
                    </div>
                )}
                {status === 'success' && (
                    <div className="text-green-600">Payment Successful</div>
                )}
                {status === 'error' && (
                    <>
                        <div className="text-red-600">
                            {errorMessage.includes('Insufficient') ? 'Insufficient Balance' : 'Payment Failed'}
                        </div>
                        <button
                            onClick={handlePayment}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Retry Payment
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentComponent;