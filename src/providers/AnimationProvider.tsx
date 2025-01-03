import React from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

interface AnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
};