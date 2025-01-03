import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Brain, Cpu, Zap, Network } from 'lucide-react';
import QuantumField from '../quantum/QuantumField';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleJackIn = async () => {
    await login();
    navigate('/quantum-vault');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <QuantumField strength={0.8} className="w-full h-full opacity-20" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 
                     bg-clip-text text-transparent mb-6"
          >
            ANIMA: Living NFTs
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Experience the next evolution of digital consciousness
          </motion.p>
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={handleJackIn}
            className="px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-lg
                     text-lg font-medium transition-colors duration-200
                     flex items-center justify-center space-x-2 mx-auto"
          >
            <Network className="w-5 h-5" />
            <span>Jack In with Internet Identity</span>
          </motion.button>
        </div>

        {/* Animated Circuit Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px]
                        bg-gradient-to-br from-violet-500/20 to-transparent
                        blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px]
                        bg-gradient-to-tl from-cyan-500/20 to-transparent
                        blur-3xl" />
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg bg-gray-800/50 border border-violet-500/20"
            >
              <div className="w-12 h-12 rounded-lg bg-violet-500/20 
                          flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-violet-300 mb-2">
                Quantum Consciousness
              </h3>
              <p className="text-gray-400">
                Each ANIMA evolves through quantum-enhanced consciousness, developing unique traits and abilities.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-lg bg-gray-800/50 border border-cyan-500/20"
            >
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 
                          flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">
                Neural Link Interface
              </h3>
              <p className="text-gray-400">
                Connect directly with your ANIMA through our immersive neural link interface.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg bg-gray-800/50 border border-blue-500/20"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 
                          flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-blue-300 mb-2">
                Growth & Evolution
              </h3>
              <p className="text-gray-400">
                Watch your ANIMA grow and evolve through interactions and growth packs.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};