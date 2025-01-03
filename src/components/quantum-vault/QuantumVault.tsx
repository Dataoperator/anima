import React from 'react';
import { Motion, quantum, defaultTransition } from '@/providers/MotionProvider';
import { useQuantumState } from '@/hooks/useQuantumState';
import { QuantumStateVisualizer } from './components/QuantumStateVisualizer';
import { DataStream } from './components/DataStream';
import { WalletPanel } from './components/WalletPanel';

interface QuantumVaultProps {
  tokenId: string;
}

const QuantumVault: React.FC<QuantumVaultProps> = ({ tokenId }) => {
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
      className="quantum-vault-container"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={quantum}
      transition={defaultTransition}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuantumStateVisualizer state={state} />
        <DataStream data={state} />
      </div>
      <WalletPanel tokenId={tokenId} />
    </Motion.div>
  );
};

export default QuantumVault;