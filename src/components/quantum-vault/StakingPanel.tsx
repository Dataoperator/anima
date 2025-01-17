import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';
import { useQuantumState } from '@/hooks/useQuantumState';
import { Lock, Unlock, AlertCircle, ChevronRight, Clock, Zap } from 'lucide-react';
import type { StakingTier } from '@/types';

// Previous code remains exactly the same until StakingConfirmation component...

const StakingConfirmation: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Staking Successful!
        </h3>
        <p className="text-gray-400 mb-6">
          Your ANIMA tokens have been successfully staked. They will start generating rewards immediately.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium"
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

function calculatePotentialRewards(amount: number, tier: StakingTier) {
  const dailyRate = tier.apy / 365;
  const dailyReward = (amount * dailyRate) / 100;
  return {
    daily: dailyReward,
    monthly: dailyReward * 30,
    yearly: amount * (tier.apy / 100)
  };
}

export default StakingPanel;