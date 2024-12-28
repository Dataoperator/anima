import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAnimaChat } from '@/hooks/useAnimaChat';
import ImmersiveAnimaUI from './ImmersiveAnimaUI';

const AnimaChat = () => {
  const { identity, actor } = useAuth();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError
  } = useAnimaChat(actor, identity);

  const personality = {
    traits: [
      ['Curiosity', 0.8],
      ['Empathy', 0.7],
      ['Creativity', 0.9],
      ['Logic', 0.85],
      ['Humor', 0.6],
    ]
  };

  const metrics = {
    'Total Interactions': messages.length,
    'Response Time': '1.2s',
    'Engagement Score': '95%',
    'Learning Rate': '82%'
  };

  return (
    <ImmersiveAnimaUI
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
      error={error}
      onClearError={clearError}
      animaName="Living NFT ✨"
      personality={personality}
      metrics={metrics}
      isTyping={isLoading}
    />
  );
};

export default AnimaChat;