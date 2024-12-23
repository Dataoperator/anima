import React from 'react';
import { Sparkles } from 'lucide-react';

// Export a fallback component in case the icon fails to load
export const IconFallback = () => (
  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
);

// Export wrapped icons with error handling
export const SafeSparkles = (props) => {
  try {
    return <Sparkles {...props} />;
  } catch (error) {
    console.error('Failed to load Sparkles icon:', error);
    return <IconFallback />;
  }
};