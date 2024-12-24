import React from 'react';
import { useAuth } from '../../AuthProvider';
import { useAnimaChat } from '../../hooks/useAnimaChat';
import ImmersiveAnimaUI from './ImmersiveAnimaUI';

const AnimaChat = () => {
  const { actor, identity, animaName } = useAuth();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
  } = useAnimaChat();

  return (
    <ImmersiveAnimaUI
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
      error={error}
      onClearError={clearError}
      animaName={animaName}
      personality={{
        traits: [
          ['Curiosity', 0.8],
          ['Empathy', 0.7],
          ['Creativity', 0.9],
          ['Logic', 0.85],
          ['Humor', 0.6],
        ]
      }}
      metrics={{
        'Total Interactions': messages.length,
        'Response Time': '1.2s',
        'Engagement Score': 0.95,
        'Learning Rate': 0.82,
      }}
    />
  );
};

export default AnimaChat;