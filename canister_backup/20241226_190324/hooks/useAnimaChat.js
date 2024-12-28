import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useAnimaChat(actor, identity) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const clearError = useCallback(() => setError(null), []);
  const resetRetryCount = useCallback(() => setRetryCount(0), []);

  const sendMessage = useCallback(async (content) => {
    if (!actor || !identity) {
      setError('Not connected to Anima');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const principal = identity.getPrincipal();
      
      // Add user message immediately
      const userMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, userMessage]);

      const result = await actor.interact(principal, content);
      
      if ('Ok' in result) {
        const response = result.Ok;
        const animaMessage = {
          id: `anima-${Date.now()}`,
          content: response.response,
          sender: 'anima',
          timestamp: Date.now(),
          personality_updates: response.personality_updates || [],
          memory: response.memory,
        };
        setMessages(prev => [...prev, animaMessage]);
        resetRetryCount();
      } else {
        throw new Error(result.Err || 'Failed to get response from Anima');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to communicate with Anima');
      
      setRetryCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setError('Connection issues detected. Please refresh the page.');
        }
        return newCount;
      });
    } finally {
      setIsLoading(false);
    }
  }, [actor, identity, resetRetryCount]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
    retryCount,
  };
}