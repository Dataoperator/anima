import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const EnhancedChat = ({ anima, onInteractionComplete }) => {
  const { actor } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial greeting
    if (anima && messages.length === 0) {
      setMessages([
        {
          type: 'anima',
          content: `Hi! I'm ${anima.name}. I'm curious and eager to learn about the world. What would you like to talk about?`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [anima]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        content: userMessage,
        timestamp: Date.now(),
      },
    ]);

    setIsTyping(true);

    try {
      const response = await actor.interact(BigInt(anima.token_id), userMessage);
      
      if (response.Ok) {
        const result = response.Ok;
        
        // Add anima response with typing effect
        const words = result.response.split(' ');
        let currentResponse = '';
        
        for (const word of words) {
          currentResponse += word + ' ';
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              type: 'anima',
              content: currentResponse.trim(),
              timestamp: Date.now(),
              personalityUpdates: result.personality_updates,
              memory: result.memory,
            },
          ]);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        onInteractionComplete();
      } else {
        console.error('Interaction error:', response.Err);
        setMessages((prev) => [
          ...prev,
          {
            type: 'system',
            content: 'I encountered an error processing your message. Please try again.',
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to interact:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'system',
          content: 'Failed to communicate. Please try again later.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <AnimatePresence key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : message.type === 'system'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.personalityUpdates && message.personalityUpdates.length > 0 && (
                  <div className="mt-2 text-xs opacity-75">
                    <p>Personality changes:</p>
                    {message.personalityUpdates.map((update, i) => (
                      <span key={i} className="mr-2">
                        {update[0]}: {update[1] > 0 ? '+' : ''}{update[1].toFixed(2)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 rounded-lg p-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  transition: { repeat: Infinity, duration: 1 },
                }}
              >
                Thinking...
              </motion.div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white/5">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className={`px-6 py-2 rounded-lg font-semibold ${
              isTyping || !inputValue.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            Send
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedChat;