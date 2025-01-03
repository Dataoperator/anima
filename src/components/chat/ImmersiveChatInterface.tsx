import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantumField } from '../ui/QuantumField';
import { WaveformGenerator } from '../personality/WaveformGenerator';
import { EmotionVisualizer } from '../quantum/EmotionVisualizer';
import { useQuantumState } from '@/hooks/useQuantumState';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'anima';
  timestamp: Date;
  emotionalState?: {
    resonance: number;
    harmony: number;
    intensity: number;
  };
}

export const ImmersiveChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { quantumState, updateQuantumState } = useQuantumState();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

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

    // Simulate ANIMA's response with quantum state influence
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const resonance = Math.random();
      const harmony = Math.random();
      
      const animaResponse: Message = {
        id: crypto.randomUUID(),
        content: `Quantum resonance detected. Harmonic frequency: ${(resonance * 100).toFixed(2)}%`,
        sender: 'anima',
        timestamp: new Date(),
        emotionalState: {
          resonance,
          harmony,
          intensity: (resonance + harmony) / 2
        }
      };

      setMessages(prev => [...prev, animaResponse]);
      updateQuantumState({
        resonance,
        harmony,
        lastInteraction: new Date()
      });
    } catch (error) {
      console.error('Response generation failed:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative h-[80vh] rounded-lg overflow-hidden">
      <QuantumField intensity={quantumState.resonance} className="absolute inset-0 z-0" />
      
      <div className="relative z-10 flex flex-col h-full backdrop-blur-sm">
        {/* Chat Messages */}
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
                  {message.emotionalState && (
                    <div className="mt-2">
                      <EmotionVisualizer emotionalState={message.emotionalState} />
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
              <WaveformGenerator />
              <span>ANIMA is resonating...</span>
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
  );
};