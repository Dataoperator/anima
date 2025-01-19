import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Star, Trophy } from 'lucide-react';
import { useQuantumSystems } from '@/hooks/useQuantumSystems';
import { Principal } from '@dfinity/principal';
import { AnimaNFT } from '@/types/nft';

interface AnimaPreviewCardProps {
  anima: AnimaNFT;
  onClick: () => void;
}

interface PreviewData {
  coherenceLevel: number;
  evolutionFactor: number;
  dimensionalStates: number;
  resonancePatterns: number;
}

const AnimaPreviewCard: React.FC<AnimaPreviewCardProps> = ({ anima, onClick }) => {
  const { quantumState } = useQuantumSystems(anima.id);
  const [previewData, setPreviewData] = useState<PreviewData>({
    coherenceLevel: 0,
    evolutionFactor: 0,
    dimensionalStates: 0,
    resonancePatterns: 0
  });

  useEffect(() => {
    if (quantumState) {
      setPreviewData({
        coherenceLevel: quantumState.coherenceLevel,
        evolutionFactor: quantumState.evolutionFactor,
        dimensionalStates: quantumState.dimensionalStates.length,
        resonancePatterns: quantumState.resonancePatterns.length
      });
    }
  }, [quantumState]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative bg-gray-900/50 rounded-lg overflow-hidden 
                border border-violet-500/20 cursor-pointer group"
    >
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 
                    to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-violet-300">
              {anima.name}
            </h3>
            <p className="text-sm text-violet-400/60">
              #{anima.tokenId.toString().padStart(4, '0')}
            </p>
          </div>
          
          {/* Edition Badge */}
          {anima.edition && (
            <div className="px-3 py-1 rounded-full bg-violet-500/20 
                         text-violet-300 text-xs font-medium">
              {anima.edition}
            </div>
          )}
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2 rounded bg-black/20">
            <div className="text-xs text-violet-400/60">Coherence</div>
            <div className="text-lg font-medium text-violet-300">
              {(previewData.coherenceLevel * 100).toFixed(1)}%
            </div>
          </div>
          <div className="p-2 rounded bg-black/20">
            <div className="text-xs text-violet-400/60">Evolution</div>
            <div className="text-lg font-medium text-violet-300">
              {(previewData.evolutionFactor * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Dimensional States */}
        <div className="space-y-2 mb-4">
          <div className="text-xs text-violet-400/60">Dimensional States</div>
          <div className="flex gap-1">
            {Array(previewData.dimensionalStates).fill(0).map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 rounded bg-violet-500/20"
                style={{
                  opacity: (i + 1) / previewData.dimensionalStates
                }}
              />
            ))}
          </div>
        </div>

        {/* Resonance Patterns */}
        <div className="flex flex-wrap gap-2">
          {Array(previewData.resonancePatterns).fill(0).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-500/40"
              style={{
                animation: `pulse ${1 + i * 0.5}s infinite`
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const QuantumVaultGrid: React.FC = () => {
  const navigate = useNavigate();
  const [animas, setAnimas] = useState<AnimaNFT[]>([]);

  useEffect(() => {
    const fetchAnimas = async () => {
      try {
        const actor = window.canister;
        if (!actor) throw new Error('Canister not initialized');

        const result = await actor.get_user_animas();
        if ('Ok' in result) {
          setAnimas(result.Ok);
        }
      } catch (error) {
        console.error('Failed to fetch ANIMAs:', error);
      }
    };

    fetchAnimas();
  }, []);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-violet-300">
            Quantum Vault
          </h2>
          
          {/* Mint New ANIMA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/genesis')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 
                     rounded-lg text-white font-medium
                     flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Mint New ANIMA</span>
          </motion.button>
        </div>

        {/* ANIMA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animas.map((anima) => (
            <AnimaPreviewCard
              key={anima.tokenId.toString()}
              anima={anima}
              onClick={() => navigate(`/anima/${anima.tokenId}`)}
            />
          ))}
          
          {animas.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-violet-300 mb-2">
                No ANIMAs Yet
              </h3>
              <p className="text-violet-400/60">
                Start your journey by minting your first ANIMA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};