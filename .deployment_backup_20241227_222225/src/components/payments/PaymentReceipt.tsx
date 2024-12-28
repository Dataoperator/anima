import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface PaymentReceiptProps {
  blockHeight: bigint;
  amount: bigint;
  fee: bigint;
  timestamp: Date;
  recipient: string;
  transactionType: string;
  onClose: () => void;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  blockHeight,
  amount,
  fee,
  timestamp,
  recipient,
  transactionType,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20"
    >
      <div className="flex items-center justify-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-center mb-6 text-white">
        Payment Successful
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-gray-400">Transaction Type</span>
          <span className="text-white font-medium">{transactionType}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-gray-400">Amount</span>
          <span className="text-white font-medium">{amount.toString()} E8s</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-gray-400">Network Fee</span>
          <span className="text-white font-medium">{fee.toString()} E8s</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-gray-400">Block Height</span>
          <span className="text-white font-medium">{blockHeight.toString()}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-gray-400">Recipient</span>
          <span className="text-white font-medium text-sm truncate max-w-[200px]">
            {recipient}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-400">Timestamp</span>
          <span className="text-white font-medium">
            {timestamp.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition"
      >
        Close Receipt
      </button>
    </motion.div>
  );
};