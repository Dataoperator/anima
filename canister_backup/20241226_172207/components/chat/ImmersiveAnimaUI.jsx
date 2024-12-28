import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Loader, AlertCircle, Settings, Activity, Clock } from 'lucide-react';
import PersonalityTraits from '../personality/PersonalityTraits';

const ImmersiveAnimaUI = ({ 
  messages = [], 
  onSendMessage, 
  isLoading = false,
  error = null,
  onClearError,
  animaName = 'Anima',
  personality = {},
  metrics = {},
  isTyping = false,
}) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="flex h-screen bg-anima-light dark:bg-anima-dark">
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-border px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {animaName}
              </h1>
            </div>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    msg.isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.personality_updates && (
                    <div className="mt-2 text-xs opacity-75">
                      {msg.personality_updates.map(([trait, value], i) => (
                        <span key={trait} className="mr-2">
                          {trait}: {value.toFixed(2)}
                          {i < msg.personality_updates.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs opacity-50 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex justify-start">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
              >
                <div className="flex space-x-2">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-border bg-white dark:bg-gray-800 p-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="ml-2 text-red-700 dark:text-red-400">{error}</span>
                <button
                  onClick={onClearError}
                  className="ml-auto text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-white dark:bg-gray-900 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 dark:bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMetrics && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="w-80 bg-white dark:bg-gray-800 border-l border-border overflow-y-auto p-6"
          >
            <PersonalityTraits traits={personality.traits || []} />
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Metrics</h3>
              <div className="space-y-4">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImmersiveAnimaUI;