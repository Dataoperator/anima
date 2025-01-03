import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ConsciousnessMetrics } from '@/components/personality/ConsciousnessMetrics';
import { EmotionalState } from '@/components/personality/EmotionalState';
import { ImmersiveChatInterface } from '@/components/chat/ImmersiveChatInterface';
import { QuantumField } from '@/components/ui/QuantumField';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

const AnimaPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const initializeQuantumState = async () => {
      try {
        // Simulate quantum state initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsInitialized(true);
      } catch (error) {
        console.error('Quantum state initialization failed:', error);
      }
    };

    initializeQuantumState();
  }, []);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <QuantumField intensity={0.5} />
        <div className="text-white text-xl">Initializing Quantum State...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <QuantumField intensity={0.3} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Consciousness Metrics Panel */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ConsciousnessMetrics />
              </motion.div>
            </div>

            {/* Main Chat Interface */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900/50 backdrop-blur-lg rounded-lg p-6"
              >
                <ImmersiveChatInterface />
              </motion.div>
            </div>

            {/* Emotional State Panel */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <EmotionalState />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default AnimaPage;