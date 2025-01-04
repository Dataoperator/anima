import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Principal } from '@dfinity/principal';
import { E8s } from '@dfinity/candid/lib/cjs/idl';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: bigint;
  paymentType: 'Creation' | 'Evolution' | 'Feature';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  paymentType
}) => {
  const { actor, principal } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('pending');
      setError(null);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!actor || !principal) {
      setError('Not authenticated');
      return;
    }

    try {
      setIsProcessing(true);
      setPaymentStatus('processing');

      // Call the payment canister
      const paymentResult = await actor.process_payment({
        amount: amount,
        payer: Principal.fromText(principal),
        payment_type: paymentType
      });

      if ('Ok' in paymentResult) {
        setPaymentStatus('success');
        onSuccess();
      } else {
        throw new Error(JSON.stringify(paymentResult.Err));
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800/90 rounded-xl p-6 max-w-md w-full mx-4 backdrop-blur-xl border border-blue-500/20"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">
          Complete Payment
        </h2>

        <div className="space-y-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <p className="text-gray-300">
              Amount: {Number(amount) / 100000000} ICP
            </p>
            <p className="text-gray-400 text-sm">
              Type: {paymentType}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              className={`flex-1 py-2 px-4 rounded-lg text