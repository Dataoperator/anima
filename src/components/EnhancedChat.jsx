import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthProvider';
import { MessageCircle, Send } from 'lucide-react';

const EnhancedChat = ({ principalId }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { actor } = useAuth();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await actor.interact(principalId, message);
      if ('Ok' in result) {
        const response = result.Ok;
        setChatHistory(prev => [...prev, {
          type: 'user',
          content: message,
          timestamp: Date.now()
        }, {
          type: 'anima',
          content: response.response,
          timestamp: Date.now(),
          emotional_impact: response.memory.emotional_impact
        }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setMessage('');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{msg.content}</p>
              {msg.emotional_impact !== undefined && (
                <div className="text-xs mt-1 opacity-70">
                  Emotional Impact: {msg.emotional_impact.toFixed(2)}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className={`px-4 py-2 rounded-lg ${
              isLoading || !message.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6"
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedChat;