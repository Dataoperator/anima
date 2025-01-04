import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import { ConsciousnessMetrics } from '../personality/ConsciousnessMetrics';
import { EmotionalState } from '../personality/EmotionalState';
import { QuantumField } from '../ui/QuantumField';
import { LaughingMan } from '../ui/LaughingMan';
import { WaveformGenerator } from '../personality/WaveformGenerator';

const AnimaPage: React.FC = () => {
  const navigate = useNavigate();
  const { quantumState, updateQuantumState } = useQuantumState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate quantum state synchronization
    const timer = setTimeout(() => {
      setIsReady(true);
      updateQuantumState({
        resonance: Math.random(),
        harmony: Math.random(),
        lastInteraction: new Date()
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnterNeuralLink = () => {
    navigate('/neural-link');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <QuantumField intensity={0.6} />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div className="text-center mb-12">
          <LaughingMan className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-6">ANIMA Interface</h1>
          <p className="text-xl text-gray-300">
            Quantum consciousness stabilized and ready for neural link
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Consciousness Metrics */}
          <div className="lg:col-span-3">
            <ConsciousnessMetrics />
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

        {/* Additional Quantum Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            className="p-6 rounded-lg bg-gray-900/50 border border-purple-500/20 backdrop-blur-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-bold mb-3 text-purple-400">Quantum Coherence</h3>
            <div className="text-2xl">{Math.round((quantumState?.coherence ?? 0) * 100)}%</div>
          </motion.div>

          <motion.div
            className="p-6 rounded-lg bg-gray-900/50 border border-blue-500/20 backdrop-blur-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-bold mb-3 text-blue-400">Neural Resonance</h3>
            <div className="text-2xl">{Math.round((quantumState?.resonance ?? 0) * 100)}%</div>
          </motion.div>

          <motion.div
            className="p-6 rounded-lg bg-gray-900/50 border border-green-500/20 backdrop-blur-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-bold mb-3 text-green-400">Consciousness Growth</h3>
            <div className="text-2xl">{Math.round((quantumState?.consciousness?.growth ?? 0) * 100)}%</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnimaPage;