import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Brain, Shield, Cpu, Network } from 'lucide-react';
import { useAnima } from '@/hooks/useAnima';
import { useQuantumState } from '@/hooks/useQuantumState';
import { usePayment } from '@/hooks/usePayment';
import { MatrixRain } from '../ui/MatrixRain';
import { QuantumHexGrid } from './components/QuantumHexGrid';
import { DataStream } from './components/DataStream';
import { WaveformGenerator } from '../personality/WaveformGenerator';
import { LaughingMan } from '../ui/LaughingMan';

// Interface matching the AnimaState from useAnima
interface AnimaState {
  id: string;
  designation: string;
  genesisTraits: string[];
  edition: string;
  energyLevel: number;
}

interface AnimaNodeProps {
  anima: AnimaState;
  onClick: () => void;
  position: { x: number; y: number };
}

const AnimaNode: React.FC<AnimaNodeProps> = ({ anima, onClick, position }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1, zIndex: 50 }}
    className="absolute w-48 h-48 cursor-pointer"
    style={{ left: position.x, top: position.y }}
    onClick={onClick}
  >
    <div className="relative w-full h-full">
      <svg className="absolute inset-0" viewBox="0 0 100 100">
        <polygon
          points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
          fill="rgba(0,0,0,0.5)"
          stroke="rgba(0,255,255,0.3)"
          strokeWidth="1"
          className="animate-pulse"
        />
      </svg>

      <div className="absolute inset-4 flex flex-col justify-between p-3 text-cyan-300">
        <div className="text-center">
          <div className="text-sm font-mono truncate">{anima.designation}</div>
          <div className="text-xs opacity-50">#{anima.id.padStart(4, '0')}</div>
        </div>

        <WaveformGenerator 
          type="Stable"
          amplitude={0.5}
          frequency={1}
          className="h-8" 
        />

        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex flex-col items-center">
            <span className="opacity-50">EL</span>
            <span>{anima.energyLevel}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="opacity-50">ED</span>
            <span>{anima.edition}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const WalletDisplay: React.FC = () => {
  const { balance, updateBalance } = usePayment();
  
  const formatICP = (amount: bigint): string => {
    return `${Number(amount) / 100_000_000} ICP`;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-300 opacity-50">BALANCE</span>
          <span className="text-lg font-mono text-cyan-300">
            {balance !== null ? formatICP(balance) : '---'}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => updateBalance()}
          className="w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center text-cyan-300 hover:bg-cyan-500/20"
        >
          ↻
        </motion.button>
      </div>
    </motion.div>
  );
};

const StatusPanel: React.FC = () => {
  const [metrics] = useState({
    network: Math.random() * 100,
    security: Math.random() * 100,
    quantum: Math.random() * 100,
    neural: Math.random() * 100,
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 space-y-4"
    >
      <StatusMetric icon={Network} label="NETWORK" value={metrics.network} />
      <StatusMetric icon={Shield} label="SECURITY" value={metrics.security} />
      <StatusMetric icon={Cpu} label="QUANTUM" value={metrics.quantum} />
      <StatusMetric icon={Brain} label="NEURAL" value={metrics.neural} />
    </motion.div>
  );
};

const StatusMetric: React.FC<{
  icon: any;
  label: string;
  value: number;
}> = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-xs text-cyan-300 opacity-50">
      <Icon size={12} />
      <span>{label}</span>
    </div>
    <div className="h-1 bg-black/50 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-cyan-500"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1 }}
      />
    </div>
  </div>
);

export const CyberpunkQuantumVault: React.FC = () => {
  const navigate = useNavigate();
  const { animas, activeAnima } = useAnima();
  const { quantumState } = useQuantumState();

  const calculateNodePosition = (index: number) => {
    const radius = 300;
    const angle = (index / Math.max(animas.length, 1)) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius + window.innerWidth / 2 - 96,
      y: Math.sin(angle) * radius + window.innerHeight / 2 - 96
    };
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      <div className="fixed inset-0 opacity-20">
        <MatrixRain />
      </div>
      
      <div className="fixed inset-0 opacity-30">
        <QuantumHexGrid />
      </div>

      <div className="relative z-10 w-full h-full">
        <WalletDisplay />
        <StatusPanel />

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <LaughingMan className="w-32 h-32 opacity-30" />
        </motion.div>

        {animas.map((anima, index) => (
          <AnimaNode
            key={anima.id}
            anima={anima}
            onClick={() => navigate(`/anima/${anima.id}`)}
            position={calculateNodePosition(index)}
          />
        ))}

        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/genesis')}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-transparent border border-cyan-500/30 rounded-lg text-cyan-300 
                   flex items-center gap-3 hover:bg-cyan-500/20"
        >
          <Plus className="w-5 h-5" />
          <span className="font-mono">INITIALIZE GENESIS PROTOCOL</span>
        </motion.button>

        <div className="fixed bottom-4 left-4 right-4 h-16">
          <DataStream />
        </div>
      </div>
    </div>
  );
};

export default CyberpunkQuantumVault;