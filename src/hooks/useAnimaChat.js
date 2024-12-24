import { useState, useCallback } from 'react';
import { useAuth } from '../AuthProvider';

export const useAnimaChat = () => {
  const { actor, identity } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const clearError = () => setError(null);
  const resetRetryCount = () => setRetryCount(0);

  const sendMessage = useCallback(async (content) => {
    if (!actor || !identity) {
      setError('Not connected to Anima');
      return;
    }

    setIsLoading(true);
    try {
      const principal = identity.getPrincipal();
      console.log('Sending message with principal:', principal.toString());
      
      const userMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, userMessage]);

      console.log('Calling interact with:', { principal, content });
      const result = await actor.interact(principal, content);
      console.log('Interact result:', result);
      
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
      } else if ('Err' in result) {
        console.error('Interaction error:', result.Err);
        throw new Error(JSON.stringify(result.Err));
      } else {
        console.error('Unexpected result format:', result);
        throw new Error('Unexpected response format from Anima');
      }
    } catch (err) {
      console.error('Message sending failed:', err);
      setError(typeof err === 'string' ? err : err.message || 'Failed to send message. Please try again.');
      setRetryCount(prev => prev + 1);

      if (retryCount >= 3) {
        setError('Multiple send attempts failed. Please refresh the page.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [actor, identity, retryCount]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
    resetRetryCount,
  };
};

export default useAnimaChat;