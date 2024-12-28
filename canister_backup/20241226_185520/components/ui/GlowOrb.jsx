import React from 'react';
import { motion } from 'framer-motion';

export const GlowOrb = () => {
  return (
    <motion.div
      className="absolute z-0 opacity-75 pointer-events-none"
      initial={{ scale: 0.8 }}
      animate={{
        scale: [0.8, 1.2, 0.8],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(32,129,226,0.2) 0%, rgba(17,153,250,0.1) 50%, transparent 70%)',
        filter: 'blur(60px)',
        transform: 'translate(-50%, -50%)',
        left: '50%',
        top: '45%',
      }}
    />
  );
};