import React from 'react';
import { motion } from 'framer-motion';
import { WalletPanel } from './components/WalletPanel';
import { QuantumStateVisualizer } from './QuantumStateVisualizer';
import { DataStream } from './DataStream';
import { GrowthPackPanel } from './GrowthPackPanel';

export const QVGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Wallet Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <WalletPanel />
      </motion.div>

      {/* Quantum State Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border border-green-500/30 rounded-lg p-6"
      >
        <QuantumStateVisualizer />
      </motion.div>

      {/* Data Stream Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border border-green-500/30 rounded-lg p-6"
      >
        <DataStream />
      </motion.div>

      {/* Growth Packs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border border-green-500/30 rounded-lg p-6"
      >
        <GrowthPackPanel />
      </motion.div>
    </div>
  );
};

export default QVGrid;