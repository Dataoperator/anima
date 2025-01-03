import React from 'react';
import { Motion, quantum, defaultTransition } from '@/providers/MotionProvider';
import { useQuantumState } from '@/hooks/useQuantumState';
import { QuantumStateVisualizer } from './components/QuantumStateVisualizer';
import { DataStream } from './DataStream';
import { Wallet } from '@/components/ui/Wallet';
import { PaymentPanel } from '@/components/payment/PaymentPanel';

interface QuantumVaultProps {
  tokenId?: string;
}

export const QuantumVault: React.FC<QuantumVaultProps> = ({ tokenId = '0' }) => {
  const { state, loading, error } = useQuantumState(tokenId);

  if (loading) {
    return (
      <Motion.div
        className="flex items-center justify-center min-h-[400px]"
        initial="hidden"
        animate="visible"
        variants={quantum}
      >
        <div className="text-quantum-blue animate-pulse">
          Initializing Quantum State...
        </div>
      </Motion.div>
    );
  }

  if (error) {
    return (
      <Motion.div
        className="text-red-500 p-4"
        initial="hidden"
        animate="visible"
        variants={quantum}
      >
        Error: {error}
      </Motion.div>
    );
  }

  return (
    <Motion.div
      className="quantum-vault-container p-6 space-y-6"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={quantum}
      transition={defaultTransition}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuantumStateVisualizer state={state} />
        <DataStream quantumState={state} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Wallet className="bg-gray-800/50 border border-violet-500/20" />
        <PaymentPanel />
      </div>
    </Motion.div>
  );
};