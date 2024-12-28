import React from 'react';
import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 1, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-12 h-12 border-4 border-[#2081E2] border-t-transparent rounded-full"
        />
      </div>
    </div>
  );
};