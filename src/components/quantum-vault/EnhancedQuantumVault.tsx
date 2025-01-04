import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useAnima } from '@/hooks/useAnima';
import { useQuantumState } from '@/hooks/useQuantumState';
import { Plus, Sparkles, Star, Trophy, Brain, Zap } from 'lucide-react';
import { QuantumField } from '../ui/QuantumField';
import { WaveformGenerator } from '../personality/WaveformGenerator';
import { QuantumParticle } from './components/QuantumParticle';
import { QuantumStateVisualizer } from './components/QuantumStateVisualizer';
import { QuantumInteractions } from './components/QuantumInteractions';
import { MatrixRain } from '../ui/MatrixRain';
import { LaughingMan } from '../ui/LaughingMan';
import { PaymentPanel } from '../payment/PaymentPanel';
import type { AnimaNFT } from '@/types';

interface AnimaPreviewCardProps {
  anima: AnimaNFT;
  quantumState: any;
  onClick: () => void;
}

const AnimaPreviewCard: React.FC<AnimaPreviewCardProps> = ({ anima, quantumState, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative bg-gray-900/50 rounded-lg overflow-hidden border border-violet-500/20 cursor-pointer group"
    >
      {/* Quantum Background Effect */}
      <div className="absolute inset-0">
        <QuantumField intensity={quantumState?.resonance ?? 0.5} />
      </div>

      {/* Content */}
      <div className="relative p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-violet-300">{anima.name}</h3>
            <p className="text-sm text-violet-400/60">
              #{anima.token_id.toString().padStart(4, '0')}
            </p>
          </div>
          
          {anima.metadata.edition_type && (
            <div className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium">
              {anima.metadata.edition_type}
            </div>
          )}
        </div>

        {/* Quantum Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2 rounded bg-black/20 backdrop-blur-lg">
            <div className="text-xs text-violet-400/60">Coherence</div>
            <div className="text-lg font-medium text-violet-300">
              {(anima.quantum_state.coherence * 100).toFixed(1)}%
            </div>
          </div>
          <div className="p-2 rounded bg-black/20 backdrop-blur-lg">
            <div className="text-xs text-violet-400/60">Evolution</div>
            <div className="text-lg font-medium text-violet-300">
              Level {anima.metadata.evolution_level}
            </div>
          </div>
        </div>

        {/* Quantum State Visualizer */}
        <div className="h-24 mb-4">
          <WaveformGenerator />
        </div>

        {/* Genesis Traits */}
        {anima.metadata.genesis_traits && (
          <div className="space-y-2">
            <div className="text-xs text-violet-400/60">Genesis Traits</div>
            <div className="flex flex-wrap gap-2">
              {anima.metadata.genesis_traits.map((trait, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-medium
                           flex items-center space-x-1"
                >
                  <Star className="w-3 h-3" />
                  <span>{trait}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {anima.metadata.achievements?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {anima.metadata.achievements.map((achievement, i) => (
              <div
                key={i}
                className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-medium
                         flex items-center space-x-1"
              >
                <Trophy className="w-3 h-3" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const EnhancedQuantumVault: React.FC = () => {
  const navigate = useNavigate();
  const { animas } = useAnima();
  const { quantumState, updateQuantumState } = useQuantumState();
  const [selectedAnima, setSelectedAnima] = useState<AnimaNFT | null>(null);
  const [showGenesis, setShowGenesis] = useState(false);

  const handleAnimaClick = (anima: AnimaNFT) => {
    setSelectedAnima(anima);
    // Update quantum state based on interaction
    updateQuantumState({
      resonance: Math.random(),
      harmony: Math.random(),
      lastInteraction: new Date()
    });
  };

  const handleStartGenesis = () => {
    setShowGenesis(true);
    navigate('/genesis');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <QuantumField intensity={0.7} />
      <MatrixRain opacity={0.1} />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <LaughingMan className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-6">Quantum Vault Interface</h1>
          <p className="text-xl text-gray-300">
            {animas.length > 0 ? 'Your ANIMAs await connection' : 'Begin your quantum journey'}
          </p>
        </motion.div>

        {/* Quantum State Overview */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 3D Quantum State Visualizer */}
            <div className="lg:col-span-2 aspect-video bg-gray-900/50 rounded-lg overflow-hidden border border-violet-500/20">
              <Canvas>
                <QuantumStateVisualizer
                  quantumState={quantumState}
                  entanglementLevel={0.5}
                  evolutionStage={1}
                />
              </Canvas>
            </div>

            {/* Quantum Metrics */}
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-gray-900/50 border border-violet-500/20 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-violet-300 mb-4">Quantum Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-violet-400/60">Coherence</div>
                    <div className="text-2xl font-medium text-violet-300">
                      {Math.round((quantumState?.coherence ?? 0) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-violet-400/60">Harmony</div>
                    <div className="text-2xl font-medium text-violet-300">
                      {Math.round((quantumState?.harmony ?? 0) * 100)}%
                    </div>
                  </div>
                  <WaveformGenerator />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ANIMA Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-violet-300">Your ANIMAs</h2>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartGenesis}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg text-white font-medium
                       flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Begin Genesis</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animas.map((anima) => (
              <AnimaPreviewCard
                key={anima.token_id}
                anima={anima}
                quantumState={quantumState}
                onClick={() => handleAnimaClick(anima)}
              />
            ))}
            
            {animas.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-violet-300 mb-2">
                  No ANIMAs Yet
                </h3>
                <p className="text-violet-400/60">
                  Start your journey by initializing the Genesis Protocol
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected ANIMA Details */}
        <AnimatePresence>
          {selectedAnima && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="max-w-2xl w-full p-6">
                <QuantumInteractions anima={selectedAnima} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Genesis Protocol Panel */}
        {showGenesis && (
          <PaymentPanel className="mt-12" />
        )}
      </div>
    </div>
  );
};

export default EnhancedQuantumVault;