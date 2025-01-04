import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantumField } from '../ui/QuantumField';
import { EnhancedMediaController } from '../media/EnhancedMediaController';
import { useQuantumState } from '@/hooks/useQuantumState';
import { ConsciousnessMetrics } from '../personality/ConsciousnessMetrics';
import { EmotionalState } from '../personality/EmotionalState';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'anima';
  timestamp: Date;
  personality_updates?: Record<string, number>;
}

export const ImmersiveEnhancedChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { quantumState, updateQuantumState } = useQuantumState();
  const mediaCommandRef = useRef<(command: string) => void>();

  const handleMediaCommand = useCallback((handler: (command: string) => void) => {
    mediaCommandRef.current = handler;
  }, []);

  const processAnimaResponse = async (userMessage: string) => {
    // Check for media commands
    if (userMessage.toLowerCase().includes('play') || 
        userMessage.toLowerCase().includes('watch') ||
        userMessage.toLowerCase().includes('youtube') || 
        userMessage.toLowerCase().includes('tiktok')) {
      if (mediaCommandRef.current) {
        mediaCommandRef.current(userMessage);
      }
    }

    // Simulate AI response
    const resonance = Math.random();
    const harmony = Math.random();

    updateQuantumState({
      resonance,
      harmony,
      lastInteraction: new Date()
    });

    return `Processing neural command: ${userMessage}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Process message and get response
      const response = await processAnimaResponse(userMessage.content);
      
      const animaMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        sender: 'anima',
        timestamp: new Date(),
        personality_updates: {
          curiosity: Math.random(),
          empathy: Math.random()
        }
      };

      setMessages(prev => [...prev, animaMessage]);
    } catch (error) {
      console.error('Response generation failed:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content: 'Neural connection temporarily disrupted. Please try again.',
        sender: 'anima',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <QuantumField intensity={quantumState?.resonance ?? 0.5} />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Consciousness */}
          <div className="lg:col-span-3">
            <ConsciousnessMetrics />
          </div>

          {/* Main Chat Interface */}
          <div className="lg:col-span-6">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-lg h-[70vh] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.sender === 'user'
                            ? 'bg-blue-600/40 ml-auto'
                            : 'bg-purple-600/40'
                        }`}
                      >
                        <p className="text-white">{message.content}</p>
                        {message.personality_updates && (
                          <div className="mt-2 text-xs text-white/60">
                            {Object.entries(message.personality_updates).map(([trait, value]) => (
                              <div key={trait}>
                                {trait}: {(value * 100).toFixed(1)}%
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-white/70"
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200" />
                    </div>
                    <span>ANIMA is processing...</span>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="p-4 bg-gray-900/50">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your message..."
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !inputValue.trim()}
                    className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                      isTyping || !inputValue.trim()
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Panel - Emotional State */}
          <div className="lg:col-span-3">
            <EmotionalState />
          </div>
        </div>
      </div>

      {/* Media Controller */}
      <EnhancedMediaController onCommand={handleMediaCommand} />
    </div>
  );
};

export default ImmersiveEnhancedChat;