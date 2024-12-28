import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../AuthProvider';

const MessageBubble = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div
      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
        isUser
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-gray-700 text-gray-100 rounded-bl-none'
      }`}
    >
      <p className="text-sm">{message}</p>
    </div>
  </motion.div>
);

const AuthPlaceholder = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-gray-400 text-center px-4">
      <p>Please log in to chat with your Anima</p>
    </div>
  </div>
);

const InitializationRequired = ({ onInitialize }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-gray-400 text-center px-4">
      <p className="mb-4">You haven't created your Anima yet</p>
      <button
        onClick={onInitialize}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Your Anima
      </button>
    </div>
  </div>
);

export const Chat = () => {
  const { authState, initialize } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !authState.isAuthenticated) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

    try {
      // Ensure we have both actor and principal
      if (!authState.actor || !authState.principal) {
        throw new Error('Authentication not complete');
      }

      const response = await authState.actor.interact(authState.principal, userMessage);
      
      // Handle the response based on our Rust backend's Result type
      if (typeof response === 'string') {
        setMessages(prev => [...prev, { text: response, isUser: false }]);
      } else if ('Ok' in response) {
        setMessages(prev => [...prev, { text: response.Ok, isUser: false }]);
      } else if ('Err' in response) {
        throw new Error(response.Err);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: "I apologize, but I'm having trouble responding right now. Please try again.",
        isUser: false,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!authState.isAuthenticated) {
    return <AuthPlaceholder />;
  }

  if (!authState.isInitialized) {
    return <InitializationRequired onInitialize={() => initialize('MyAnima')} />;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">
          Chat with {authState?.animaName || 'your Anima'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-700 rounded-2xl px-4 py-2 rounded-bl-none">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-gray-300 text-sm"
                >
                  Thinking...
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex space-x-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;