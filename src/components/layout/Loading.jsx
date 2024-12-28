import React from 'react';
import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mb-4 mx-auto"
        >
          <div className="w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Your Living NFT</h2>
        <p className="text-gray-400">Please wait while we connect to the Internet Computer...</p>
      </motion.div>
    </div>
  );
};