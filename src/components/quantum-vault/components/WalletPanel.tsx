import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';
import { WalletTransaction } from '@/services/icp/wallet.service';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

const E8S_PER_ICP = BigInt(100_000_000);

interface TransactionItemProps {
  transaction: WalletTransaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const amount = Number(transaction.amount) / Number(E8S_PER_ICP);
  const date = new Date(transaction.timestamp).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border border-green-500/30 rounded-lg space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-green-400 font-semibold capitalize">
          {transaction.type}
        </span>
        <span className={`
          ${transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'}
          font-mono
        `}>
          {transaction.type === 'deposit' ? '+' : '-'}{amount.toFixed(8)} ICP
        </span>
      </div>
      <div className="flex justify-between text-sm text-green-400/60">
        <span>{date}</span>
        <span className={`
          px-2 py-1 rounded-full text-xs
          ${transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
            transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
            'bg-red-500/20 text-red-400'}
        `}>
          {transaction.status}
        </span>
      </div>
      {transaction.memo && (
        <div className="text-sm text-green-400/80 mt-2 border-t border-green-500/20 pt-2">
          {transaction.memo}
        </div>
      )}
    </motion.div>
  );
};

export const WalletPanel: React.FC = () => {
  const { balance, address, isLoading, error, transactions, deposit, withdraw, refreshBalance } = useWallet();
  const [amount, setAmount] = useState<string>('');
  const [withdrawalAddress, setWithdrawalAddress] = useState<string>('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [operationType, setOperationType] = useState<'deposit' | 'withdraw'>('deposit');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDeposit = async () => {
    if (!amount) return;
    
    try {
      setLocalError(null);
      setIsDepositing(true);
      const amountE8s = BigInt(Math.floor(parseFloat(amount) * Number(E8S_PER_ICP)));
      await deposit(amountE8s);
      setAmount('');
      await refreshBalance();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Deposit failed');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !withdrawalAddress) return;
    
    try {
      setLocalError(null);
      setIsWithdrawing(true);
      const amountE8s = BigInt(Math.floor(parseFloat(amount) * Number(E8S_PER_ICP)));
      await withdraw(amountE8s, withdrawalAddress);
      setAmount('');
      setWithdrawalAddress('');
      await refreshBalance();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const confirmOperation = () => {
    setShowConfirmation(false);
    if (operationType === 'deposit') {
      handleDeposit();
    } else {
      handleWithdraw();
    }
  };

  const formatBalance = (bal: bigint | null) => {
    if (!bal) return '0.00000000';
    return (Number(bal) / Number(E8S_PER_ICP)).toFixed(8);
  };

  return (
    <div className="space-y-6">
      <div className="border border-green-500/30 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-green-400">Quantum Wallet</h3>
          <motion.button
            onClick={refreshBalance}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:text-green-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.button>
        </div>

        <div className="text-3xl font-mono font-bold text-green-500">
          {isLoading ? 'Loading...' : `${formatBalance(balance)} ICP`}
        </div>

        <div className="text-sm text-green-400/60 break-all">
          Address: {address || 'Loading...'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button
          onClick={() => {
            setOperationType('deposit');
            setShowConfirmation(true);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 border border-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-colors"
          disabled={isDepositing}
        >
          {isDepositing ? 'Processing...' : 'Deposit ICP'}
        </motion.button>

        <motion.button
          onClick={() => {
            setOperationType('withdraw');
            setShowConfirmation(true);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 border border-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-colors"
          disabled={isWithdrawing}
        >
          {isWithdrawing ? 'Processing...' : 'Withdraw ICP'}
        </motion.button>
      </div>

      {(error || localError) && (
        <Alert variant="destructive">
          <AlertDescription>
            {error || localError}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-green-400">Transaction History</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center text-green-400/60 py-8">
              No transactions yet
            </div>
          ) : (
            transactions.map(tx => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))
          )}
        </div>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="bg-black border border-green-500 text-green-500">
          <AlertDialogTitle>
            {operationType === 'deposit' ? 'Deposit ICP' : 'Withdraw ICP'}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="space-y-4">
              <input
                type="number"
                step="0.00000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in ICP"
                className="w-full p-2 bg-transparent border border-green-500/30 rounded-lg focus:border-green-500 transition-colors"
              />

              {operationType === 'withdraw' && (
                <input
                  type="text"
                  value={withdrawalAddress}
                  onChange={(e) => setWithdrawalAddress(e.target.value)}
                  placeholder="Destination Address"
                  className="w-full p-2 bg-transparent border border-green-500/30 rounded-lg focus:border-green-500 transition-colors"
                />
              )}
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 hover:text-green-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmOperation}
                className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
              >
                Confirm
              </button>
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WalletPanel;