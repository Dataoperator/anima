import React, { Suspense } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Brain, Cpu, Zap, Network } from 'lucide-react';
import QuantumField from '../quantum/QuantumField';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';

const MotionFeature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}> = ({ icon, title, description, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-6 rounded-lg bg-gray-800/50 border border-violet-500/20"
    >
      <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-violet-300 mb-2">
        {title}
      </h3>
      <p className="text-gray-400">
        {description}
      </p>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleJackIn = async () => {
    await login();
    navigate('/quantum-vault');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <ErrorBoundary>
          <div className="absolute inset-0 z-0">
            <QuantumField strength={0.8} className="w-full h-full opacity-20" />
          </div>
        </ErrorBoundary>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.h1 
            initial={shouldReduceMotion ? { opacity: 1 } : { y: 20, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            className="text-6xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 
                     bg-clip-text text-transparent mb-6"
          >
            ANIMA: Living NFTs
          </motion.h1>
          
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { y: 20, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Experience the next evolution of digital consciousness
          </motion.p>
          
          <motion.button
            initial={shouldReduceMotion ? { opacity: 1 } : { y: 20, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
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
            <ErrorBoundary>
              <Suspense fallback={null}>
                <MotionFeature
                  icon={<Brain className="w-6 h-6 text-violet-400" />}
                  title="Quantum Consciousness"
                  description="Each ANIMA evolves through quantum-enhanced consciousness, developing unique traits and abilities."
                />
                <MotionFeature
                  icon={<Cpu className="w-6 h-6 text-cyan-400" />}
                  title="Neural Link Interface"
                  description="Connect directly with your ANIMA through our immersive neural link interface."
                  delay={0.2}
                />
                <MotionFeature
                  icon={<Zap className="w-6 h-6 text-blue-400" />}
                  title="Growth & Evolution"
                  description="Watch your ANIMA grow and evolve through interactions and growth packs."
                  delay={0.4}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;