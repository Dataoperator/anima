import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { PaymentType } from '@/types/payment';
import { usePayment } from '@/contexts/PaymentContext';
import { Loader } from '@/components/ui/loader';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentType: PaymentType;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    paymentType,
    onSuccess,
    onError
}) => {
    const { initiatePayment, paymentInProgress, paymentError } = usePayment();
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setInProgress(false);
        }
    }, [isOpen]);

    const handlePayment = async () => {
        setInProgress(true);
        try {
            const success = await initiatePayment(paymentType);
            if (success) {
                onSuccess?.();
                onClose();
            } else {
                onError?.(paymentError || 'Payment failed');
            }
        } catch (error) {
            onError?.(error instanceof Error ? error.message : 'Payment failed');
        } finally {
            setInProgress(false);
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            onOpenChange={(open) => !open && onClose()}
            className="sm:max-w-[425px]"
        >
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Complete Payment</Dialog.Title>
                    <Dialog.Description>
                        Proceed with payment for: {paymentType}
                    </Dialog.Description>
                </Dialog.Header>

                <div className="py-6">
                    {paymentError && (
                        <div className="text-red-500 text-sm mb-4">
                            {paymentError}
                        </div>
                    )}

                    {(inProgress || paymentInProgress) ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader />
                            <span className="ml-2">Processing payment...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p>Please confirm to proceed with the payment.</p>
                        </div>
                    )}
                </div>

                <Dialog.Footer>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary"
                        disabled={inProgress || paymentInProgress}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handlePayment}
                        className="btn btn-primary"
                        disabled={inProgress || paymentInProgress}
                    >
                        Confirm Payment
                    </button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog>
    );
};