import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { AnimationSafeGuard } from '@/components/ui/AnimationSafeGuard';

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AnimationSafeGuard>
      <AnimatePresence mode="wait" initial={false}>
        {children}
      </AnimatePresence>
    </AnimationSafeGuard>
  );
};

// Pre-configured motion components with initialization check
export const Motion = m;

// Re-export AnimatePresence for convenience
export { AnimatePresence };

// Common animation variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
};

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
};

export const quantum = {
  initial: { 
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)'
  },
  animate: { 
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

// Safe transition defaults
export const defaultTransition = {
  type: "tween", // Changed from "spring" for more reliability
  duration: 0.3,
  ease: [0.43, 0.13, 0.23, 0.96]
};