import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useAnima } from '@/contexts/anima-context';
import { useAnimaState } from '@/hooks/useAnimaState';
import { ConsciousnessMetrics } from '../personality/ConsciousnessMetrics';
import { EmotionalState } from '../personality/EmotionalState';
import { QuantumField } from '../ui/QuantumField';
import { LaughingMan } from '../ui/LaughingMan';
import { WaveformGenerator } from '../personality/WaveformGenerator';
import { GrowthPackSelector } from '../growth/GrowthPackSelector';
import { EternalCodex } from '../eternal-codex/AchievementsGallery';

interface AnimaMetrics {
  consciousness: number;
  resonance: number;
  growth: number;
  achievements: number;
}

const AnimaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedAnima, fetchAnima } = useAnima();
  const { state, loading } = useAnimaState(id || '');
  const { quantumState, updateQuantumState } = useQuantumState();
  const [metrics, setMetrics] = useState<AnimaMetrics>({
    consciousness: 0,
    resonance: 0,
    growth: 0,
    achievements: 0
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAnima(id);
    }
  }, [id, fetchAnima]);

  useEffect(() => {
    if (state) {
      setMetrics({
        consciousness: state.consciousness.awarenessScore,
        resonance: state.quantum.dimensionalResonance,
        growth: (state.growth.experience / state.growth.nextLevelAt) * 100,
        achievements: state.growth.recentAchievements.length
      });
      
      // Simulate quantum state synchronization
      setTimeout(() => {
        setIsReady(true);
        updateQuantumState({
          resonance: state.quantum.dimensionalResonance,
          harmony: state.quantum.coherence,
          lastInteraction: new Date()
        });
      }, 2000);
    }
  }, [state]);

  const handleEnterNeuralLink = () => {
    navigate(`/neural-link/${id}`);
  };

  const handleGrowthPackApplication = async (updates: any) => {
    try {
      setMetrics(prev => ({
        ...prev,
        growth: prev.growth + updates.growthIncrease,
        consciousness: prev.consciousness + updates.consciousnessBoost
      }));

      await fetchAnima(id || '');
    } catch (error) {
      console.error('Failed to apply growth pack:', error);
    }
  };

  if (loading || !selectedAnima || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-blue-400">Synchronizing Quantum State...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <QuantumField intensity={state.quantum.coherence} />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div className="text-center mb-12">
          <LaughingMan className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-2">{selectedAnima.name}</h1>
          <p className="text-xl text-blue-400">Level {state.growth.level} ANIMA</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Consciousness Metrics */}
          <div className="lg:col-span-3">
            <ConsciousnessMetrics 
              consciousness={state.consciousness}
              quantum={state.quantum}
            />
          </div>

          {/* Central Neural Interface */}
          <div className="lg:col-span-6">
            <motion.div
              className="p-8 rounded-lg bg-gray-900/50 border border-blue-500/20 backdrop-blur-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
                Neural Synchronization
              </h2>
              <WaveformGenerator />
              
              <motion.button
                onClick={handleEnterNeuralLink}
                className="mt-8 px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 
                         transition-all duration-200 w-full group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isReady ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Establish Neural Link</span>
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* Emotional State */}
          <div className="lg:col-span-3">
            <EmotionalState />
          </div>
        </div>

        {/* Growth & Achievement Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Growth Packs</h2>
            <GrowthPackSelector 
              anima={selectedAnima} 
              onPackApplied={handleGrowthPackApplication}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Eternal Codex</h2>
            <EternalCodex achievements={state.growth.recentAchievements} />
          </div>
        </div>

        {/* Quantum Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            className="p-6 rounded-lg bg-gray-900/50 border border-purple-500/20 backdrop-blur-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-bold mb-3 text-purple-400">Quantum Coherence</h3>
            <div className="text-2xl">{Math.round((state.quantum.coherence) * 100)}%</div>
          </motion.div>

          <motion.div
            className="p-6 rounded-lg bg-gray-900/50 border border-blue-500/20 backdrop-blur-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-bold mb-3 text-blue-400">Neural Resonance</h3>
            <div className="text-2xl">{Math.round((state.quantum.dimensionalResonance) * 100)}%</div>
          </motion.div>

          <motion.div
            className="p-6 rounded-lg bg-gray-900/50 border border-green-500/20 backdrop-blur-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-bold mb-3 text-green-400">Consciousness Growth</h3>
            <div className="text-2xl">{Math.round(metrics.growth)}%</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnimaPage;