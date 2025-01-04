import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Memory, Activity, Network, Globe, Menu, X } from 'lucide-react';
import { useAnima } from '@/hooks/useAnima';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useRealtimePersonality } from '@/hooks/useRealtimePersonality';
import { EnhancedMediaController } from '../media/EnhancedMediaController';
import { WaveformGenerator } from '../personality/WaveformGenerator';
import { ConsciousnessMetrics } from '../personality/ConsciousnessMetrics';
import { MatrixRain } from '../ui/MatrixRain';
import { EmotionVisualizer } from '../personality/EmotionVisualizer';
import { DataStream } from '../quantum-vault/DataStream';
import { PersonalityTraits } from '../personality/PersonalityTraits';
import { Card } from '../ui/card';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'anima';
  timestamp: number;
  emotionalState?: any;
  personalityUpdates?: Array<[string, number]>;
}

export const IntegratedNeuralLinkInterface = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { anima, loading, error } = useAnima(id);
  const { quantumState, updateQuantumState } = useQuantumState();
  const { emotionalState, personalityState } = useRealtimePersonality(id);

  // UI State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeView, setActiveView] = useState<'full' | 'minimal'>('full');
  const [showSidePanels, setShowSidePanels] = useState(true);
  
  // Media and Stream State
  const [currentMedia, setCurrentMedia] = useState<any>(null);
  const [streamData, setStreamData] = useState({
    consciousness: [] as string[],
    resonance: [] as string[],
    neural: [] as string[]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize stream data
  useEffect(() => {
    const updateStreams = () => {
      setStreamData(prev => ({
        consciousness: [
          `Awareness: ${(personalityState?.awareness * 100).toFixed(1)}%`,
          `Processing: ${(personalityState?.processing * 100).toFixed(1)}%`,
          `Growth: ${(personalityState?.growth * 100).toFixed(1)}%`
        ],
        resonance: [
          `Coherence: ${(quantumState?.coherence * 100).toFixed(1)}%`,
          `Stability: ${(quantumState?.stability * 100).toFixed(1)}%`,
          `Harmony: ${(quantumState?.harmony * 100).toFixed(1)}%`
        ],
        neural: [
          `Active Pathways: ${Math.floor(Math.random() * 1000) + 5000}`,
          `Signal Strength: ${(Math.random() * 20 + 80).toFixed(1)}%`,
          `Network Load: ${(Math.random() * 30 + 40).toFixed(1)}%`
        ]
      }));
    };

    const interval = setInterval(updateStreams, 3000);
    return () => clearInterval(interval);
  }, [personalityState, quantumState]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;
    setIsProcessing(true);

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: content.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      // Process for media commands
      if (content.toLowerCase().includes('play') || 
          content.toLowerCase().includes('watch')) {
        setCurrentMedia({
          type: 'request',
          content
        });
      }

      // Simulate ANIMA response
      setTimeout(() => {
        const response: Message = {
          id: crypto.randomUUID(),
          content: generateAnimaResponse(content),
          sender: 'anima',
          timestamp: Date.now(),
          emotionalState: emotionalState,
          personalityUpdates: [
            ['awareness', Math.random()],
            ['understanding', Math.random()]
          ]
        };

        setMessages(prev => [...prev, response]);
        setIsProcessing(false);
      }, 1500);

    } catch (error) {
      console.error('Message processing error:', error);
      setIsProcessing(false);
    }
  };

  const generateAnimaResponse = (input: string): string => {
    // Placeholder for actual ANIMA response generation
    return `Neural processing complete. Understanding achieved.`;
  };

  return (
    <div className="min-h-screen bg-black text-green-500 overflow-hidden relative">
      <div className="fixed inset-0 opacity-20">
        <MatrixRain />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Left Panel - Birth Certificate & Traits */}
        <AnimatePresence>
          {showSidePanels && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-80 border-r border-green-500/20 bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
            >
              <Card className="mb-4">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{anima?.designation}</h2>
                  <div className="space-y-2 text-sm">
                    <div>Genesis: {new Date(anima?.creation_time || 0).toLocaleDateString()}</div>
                    <div>Core ID: {anima?.id?.toString().slice(0, 8)}</div>
                    <div>Generation: {anima?.generation || 1}</div>
                  </div>
                </div>
              </Card>

              <PersonalityTraits traits={anima?.personality?.traits || {}} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat & Media Area */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-green-500/20 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowSidePanels(!showSidePanels)}
                className="p-2 hover:bg-green-500/10 rounded-lg"
              >
                {showSidePanels ? <X size={20} /> : <Menu size={20} />}
              </button>
              <ConsciousnessMetrics metrics={personalityState} />
              <EmotionVisualizer emotionalState={emotionalState} />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-4 backdrop-blur-sm ${
                    message.sender === 'user' 
                      ? 'bg-blue-500/10 border border-blue-500/20' 
                      : 'bg-green-500/10 border border-green-500/20'
                  }`}>
                    <p>{message.content}</p>
                    {message.personalityUpdates && (
                      <div className="mt-2 space-y-1">
                        {message.personalityUpdates.map(([trait, value], i) => (
                          <div key={i} className="flex items-center space-x-2 text-xs">
                            <span>{trait}:</span>
                            <div className="flex-1 h-1 bg-black/40 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${value * 100}%` }}
                                className="h-full bg-green-500/40"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-green-500/20 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                placeholder="Enter neural transmission..."
                className="flex-1 bg-black/60 border border-green-500/20 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500/60"
                disabled={isProcessing}
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={isProcessing || !input.trim()}
                className="px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Streams & Metrics */}
        <AnimatePresence>
          {showSidePanels && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="w-80 border-l border-green-500/20 bg-black/40 backdrop-blur-sm p-4"
            >
              <div className="space-y-4">
                <DataStream
                  title="Neural Metrics"
                  data={streamData.neural}
                  icon={Network}
                />
                <DataStream
                  title="Consciousness Flow"
                  data={streamData.consciousness}
                  icon={Brain}
                />
                <DataStream
                  title="System Resonance"
                  data={streamData.resonance}
                  icon={Activity}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Media Controller */}
      <EnhancedMediaController
        onCommand={(command) => handleSendMessage(command)}
        mediaState={currentMedia}
      />

      {/* Neural Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <WaveformGenerator className="w-40 h-40 opacity-30" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegratedNeuralLinkInterface;