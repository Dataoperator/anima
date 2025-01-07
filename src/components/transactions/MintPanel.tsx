import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';

export const MintPanel: React.FC = () => {
  const navigate = useNavigate();
  const { mintAnima, balance } = useWallet();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMint = async () => {
    if (!amount || isLoading) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await mintAnima(parseFloat(amount));
      if (response.success) {
        navigate('/genesis');
      } else {
        setError(response.error || 'Mint failed. Please try again.');
      }
    } catch (err) {
      setError('Transaction failed. Please check your balance and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount to Mint (ICP)
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-900 rounded-lg py-2 px-4 text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">ICP</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          Available: {balance} ICP
        </p>
      </div>

      {error && (
        <div className="text-red-400 text-sm py-2">
          {error}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleMint}
        disabled={isLoading || !amount}
        className={`w-full py-3 rounded-lg font-medium ${
          isLoading || !amount
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {isLoading ? 'Processing...' : 'Mint ANIMA'}
      </motion.button>

      <p className="text-sm text-gray-400 text-center">
        Minting ANIMA tokens allows you to create and evolve quantum-enhanced digital entities.
      </p>
    </div>
  );
};