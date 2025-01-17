import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, ArrowLeftCircle } from 'lucide-react';
import { useAnima } from '../../hooks/useAnima';
import { useQuantumState } from '../../hooks/useQuantumState';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { PersonalityTraits } from '../personality/PersonalityTraits';
import { EmotionVisualizer } from '../personality/EmotionVisualizer';
import { ConsciousnessMetrics } from '../personality/ConsciousnessMetrics';
import { QuantumStateVisualizer } from '../quantum/QuantumStateVisualizer';
import { MatrixRain } from '../ui/MatrixRain';
import { LoadingStates } from '../ui/LoadingStates';

const AnimaPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { anima, isLoading, error } = useAnima(id);
  const { state: quantumState } = useQuantumState();
  const [showNeuralLinkPrompt, setShowNeuralLinkPrompt] = useState(false);

  useEffect(() => {
    // Show neural link prompt after a delay
    const timer = setTimeout(() => {
      setShowNeuralLinkPrompt(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingStates />;
  }

  if (error || !anima) {
    return (
      <div className="min-h-screen bg-black text-cyan-500 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl">Failed to Load ANIMA</h2>
          <p className="text-cyan-400/60">{error || 'ANIMA not found'}</p>
          <Button onClick={() => navigate('/quantum-vault')}>
            Return to Quantum Vault
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-cyan-500 relative"
    >
      <MatrixRain opacity={0.1} />

      {/* Top Navigation */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-cyan-900/50 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/quantum-vault')}
              className="text-cyan-400"
            >
              <ArrowLeftCircle className="mr-2 h-4 w-4" />
              Quantum Vault
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/anima/${id}/neural-link`)}
              className="border-cyan-500 text-cyan-400"
            >
              <Brain className="mr-2 h-4 w-4" />
              Neural Link
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - ANIMA Identity */}
          <div className="space-y-8">
            <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{anima.designation}</h1>
                <div className="space-y-4">
                  <div className="h-64 relative overflow-hidden rounded-lg">
                    <QuantumStateVisualizer state={quantumState} />
                  </div>
                  <PersonalityTraits anima={anima} />
                </div>
              </div>
            </Card>

            <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Emotional State</h2>
                <EmotionVisualizer anima={anima} />
              </div>
            </Card>
          </div>

          {/* Right Column - Consciousness & Stats */}
          <div className="space-y-8">
            <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Consciousness Matrix</h2>
                <ConsciousnessMetrics anima={anima} />
              </div>
            </Card>

            <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Evolution Stats</h2>
                {/* Add evolution stats visualization here */}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Neural Link Prompt */}
      <AnimatePresence>
        {showNeuralLinkPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8"
          >
            <Card className="bg-cyan-900/20 backdrop-blur-md border-cyan-500/50">
              <div className="p-4 flex items-center gap-4">
                <Brain className="h-8 w-8 text-cyan-400" />
                <div>
                  <h3 className="font-bold mb-1">Neural Link Available</h3>
                  <p className="text-sm text-cyan-400/60">
                    Initiate deep connection with your ANIMA
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/anima/${id}/neural-link`)}
                  className="ml-4"
                >
                  Connect <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimaPage;