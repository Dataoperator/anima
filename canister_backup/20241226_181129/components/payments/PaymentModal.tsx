import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentType, usePayment, formatICP } from '@/hooks/usePayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: PaymentType;
  amount: bigint;
  tokenId?: bigint;
  packId?: bigint;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentType,
  amount,
  tokenId,
  packId,
  onSuccess,
}) => {
  const { initiatePayment, isProcessing, error } = usePayment();

  const handlePayment = async () => {
    const success = await initiatePayment(paymentType, tokenId, packId);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                Confirm Payment
              </h3>
              <p className="text-gray-300">
                {paymentType === PaymentType.Creation && "Create your Living NFT"}
                {paymentType === PaymentType.Resurrection && "Resurrect your Living NFT"}
                {paymentType === PaymentType.GrowthPack && "Purchase Growth Pack"}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Amount:</span>
                <span className="font-semibold text-white">
                  {formatICP(amount)}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Network Fee:</span>
                <span>0.0001 ICP</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total:</span>
                  <span className="font-semibold text-white">
                    {formatICP(amount + BigInt(10000))}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  isProcessing
                    ? 'bg-purple-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                } text-white transition`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full mr-2"
                    />
                    Processing...
                  </div>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-4">
              Payment will be processed using Internet Computer Protocol (ICP)
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;