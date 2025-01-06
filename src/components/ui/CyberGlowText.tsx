import React from 'react';
import { motion } from 'framer-motion';

interface CyberGlowTextProps {
  children: React.ReactNode;
  className?: string;
}

export const CyberGlowText: React.FC<CyberGlowTextProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10">
        {children}
      </div>
      <motion.div 
        className="absolute inset-0 -z-10 blur-lg opacity-50"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ 
          background: 'radial-gradient(circle at center, var(--quantum-primary), transparent 70%)',
        }}
      />
      <div 
        className="absolute inset-0 -z-20"
        style={{ 
          background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          filter: 'blur(20px)',
        }}
      />
    </motion.div>
  );
};