import React from 'react';
import { motion } from 'framer-motion';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 mb-4 mx-auto"
        >
          <div className="w-full h-full rounded-full border-t-2 border-b-2 border-blue-500" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-lg"
        >
          <p>Initializing Quantum Interface...</p>
          <p className="text-sm text-blue-400 mt-2">Please wait while we connect to the Internet Computer</p>
        </motion.div>
      </div>
    </div>
  );
};