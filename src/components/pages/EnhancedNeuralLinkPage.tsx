import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnima } from '@/hooks/useAnima';
import { EnhancedImmersiveInterface } from '@/components/chat/EnhancedImmersiveInterface';
import { MatrixLayout } from '@/components/layout/MatrixLayout';
import { EnhancedMediaController } from '@/components/media/EnhancedMediaController';
import { useQuantumPerception } from '@/hooks/useQuantumPerception';
import { useMediaPatternAnalysis } from '@/hooks/useMediaPatternAnalysis';
import { QuantumField } from '@/components/ui/QuantumField';
import { WaveformGenerator } from '@/components/personality/WaveformGenerator';

export const EnhancedNeuralLinkPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { anima, loading, error } = useAnima(id);
  const { processMediaInteraction } = useQuantumPerception();
  const { analysisState, processVideoFrame } = useMediaPatternAnalysis();
  const [neuralInitialized, setNeuralInitialized] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNeuralCommand = useCallback(async (content: string) => {
    try {
      setIsProcessing(true);
      
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content,
        sender: 'user',
        timestamp: new Date()
      }]);

      if (content.toLowerCase().includes('play') || 
          content.toLowerCase().includes('watch')) {
        setCurrentMedia({
          type: 'request',
          content
        });
        
        processMediaInteraction({
          type: 'command',
          content,
          timestamp: Date.now()
        });
      }

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          content: `Neural processing: ${content}`,
          sender: 'anima',
          timestamp: new Date(),
          personality_updates: [
            ['understanding', analysisState.understanding],
            ['resonance', Math.random()]
          ]
        }]);
        setIsProcessing(false);
      }, 1500);

    } catch (err: any) {
      console.error('Neural command error:', err);
      setIsProcessing(false);
    }
  }, [processMediaInteraction, analysisState]);

  React.useEffect(() => {
    if (anima && !neuralInitialized) {
      const initSequence = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setNeuralInitialized(true);
        
        setMessages([{
          id: crypto.randomUUID(),
          content: `Neural link established with ${anima.name}. Quantum state synchronized.`,
          sender: 'anima',
          timestamp: new Date(),
          system: true
        }]);
      };

      initSequence();
    }
  }, [anima, neuralInitialized]);

  if (loading || !neuralInitialized) {
    return (
      <MatrixLayout>
        <div className="flex items-center justify-center min-h-screen relative">
          <QuantumField intensity={0.5} />
          <div className="relative z-10 space-y-4 text-center">
            <WaveformGenerator />
            <div className="text-green-500 animate-pulse text-xl">
              INITIALIZING NEURAL LINK...
            </div>
          </div>
        </div>
      </MatrixLayout>
    );
  }

  if (error || !anima) {
    return (
      <MatrixLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-4 text-center">
            <div className="text-red-500 text-xl">
              ERROR: {error || 'NEURAL LINK FAILED'}
            </div>
            <button
              onClick={() => navigate('/quantum-vault')}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Return to Quantum Vault
            </button>
          </div>
        </div>
      </MatrixLayout>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <QuantumField intensity={0.7} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        <EnhancedImmersiveInterface
          messages={messages}
          onSendMessage={handleNeuralCommand}
          isLoading={isProcessing}
          isTyping={isProcessing}
          animaName={anima.name}
          personality={anima.personality}
          metrics={analysisState}
          error={error}
        />

        <EnhancedMediaController
          onCommand={handleNeuralCommand}
        />
      </motion.div>
    </div>
  );
};

export default EnhancedNeuralLinkPage;