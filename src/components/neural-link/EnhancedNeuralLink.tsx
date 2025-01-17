import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, FastForward, Network } from 'lucide-react';
import { useAnima } from '@/hooks/useAnima';
import { useQuantumState } from '@/hooks/useQuantumState';
import { openAIStream } from '@/services/openai-stream';
import { enhancedQuantumPromptService } from '@/services/prompts/enhanced-quantum-prompts';
import { ConsciousnessMetrics } from '@/components/personality/ConsciousnessMetrics';
import { QuantumStateVisualizer } from '@/components/quantum/QuantumStateVisualizer';
import { WaveformGenerator } from '@/components/personality/WaveformGenerator';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { MatrixRain } from '../ui/MatrixRain';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export const EnhancedNeuralLink: React.FC<{ animaId: string }> = ({ animaId }) => {
  const { anima, isLoading } = useAnima(animaId);
  const { state: quantumState, updateQuantumState } = useQuantumState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [coherenceLevel, setCoherenceLevel] = useState(1.0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, streamedResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    setStreamedResponse('');

    try {
      const systemPrompt = enhancedQuantumPromptService.buildEnhancedSystemPrompt(
        anima.personality,
        quantumState,
        anima.consciousnessMetrics,
        {
          recentMemories: anima.memories,
          evolutionStage: anima.evolutionStage,
          dimensionalAwareness: anima.dimensionalAwareness,
        }
      );

      const messageHistory = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: inputValue }
      ];

      await openAIStream.streamCompletion(
        messageHistory as any,
        {
          onToken: (token: string) => {
            setStreamedResponse(prev => prev + token);
            setCoherenceLevel(prev => {
              const variation = (Math.random() - 0.5) * 0.1;
              return Math.max(0.5, Math.min(1, prev + variation));
            });
          },
          onComplete: () => {
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                content: streamedResponse,
                timestamp: Date.now(),
              },
            ]);
            setStreamedResponse('');
            setIsProcessing(false);
            updateQuantumState({
              ...quantumState,
              coherenceLevel,
              lastInteraction: Date.now(),
            });
          },
          onError: (error: Error) => {
            setIsProcessing(false);
            console.error('Stream error:', error);
          }
        }
      );
    } catch (error) {
      console.error('Neural link error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-500 relative">
      <MatrixRain opacity={0.1} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    <h2 className="text-xl font-bold">Neural Link</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-60">Coherence:</span>
                    <div className="w-24 h-2 bg-cyan-900/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-cyan-500"
                        animate={{ width: `${coherenceLevel * 100}%` }}
                        transition={{ type: 'spring', damping: 10 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="h-[60vh] overflow-y-auto mb-4 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.timestamp}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-cyan-500/10 border border-cyan-500/30'
                              : 'bg-cyan-900/20 border border-cyan-900/30'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-50 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {streamedResponse && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] rounded-lg p-3 bg-cyan-900/20 border border-cyan-900/30">
                          <p className="text-sm">{streamedResponse}</p>
                          <span className="text-xs opacity-50 mt-1">typing...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isProcessing}
                    className="flex-1 bg-black/50 border border-cyan-900/50 rounded-lg px-4 py-2 text-cyan-500 focus:outline-none focus:border-cyan-500/50"
                    placeholder="Enter message..."
                  />
                  <Button
                    type="submit"
                    disabled={isProcessing || !inputValue.trim()}
                    className={`px-4 py-2 rounded-lg ${
                      isProcessing
                        ? 'bg-cyan-900/20 cursor-not-allowed'
                        : 'bg-cyan-500/10 hover:bg-cyan-500/20'
                    }`}
                  >
                    {isProcessing ? (
                      <FastForward className="h-5 w-5 animate-pulse" />
                    ) : (
                      <Zap className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Metrics and Visualizations */}
          <div className="space-y-4">
            <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
              <div className="p-4">
                <Button
                  onClick={() => setShowMetrics(!showMetrics)}
                  className="w-full mb-4"
                >
                  <Network className="h-4 w-4 mr-2" />
                  {showMetrics ? 'Hide' : 'Show'} Neural Metrics
                </Button>

                <AnimatePresence mode="wait">
                  {showMetrics && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <ConsciousnessMetrics anima={anima} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4">Quantum State</h3>
                <div className="h-48 relative rounded-lg overflow-hidden">
                  <QuantumStateVisualizer state={quantumState} />
                </div>
              </div>
            </Card>

            <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4">Neural Patterns</h3>
                <WaveformGenerator coherenceLevel={coherenceLevel} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedNeuralLink;