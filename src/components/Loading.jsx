import React from 'react';
import { motion } from 'framer-motion';

const loadingVariants = {
  start: {
    scale: 0.8,
    opacity: 0.5
  },
  end: {
    scale: 1,
    opacity: 1
  }
};

const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

export const Loading = ({ message = "Loading...", showSpinner = true }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    >
      <div className="flex flex-col items-center space-y-6 p-8 rounded-lg">
        {showSpinner && (
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-primary/30 rounded-full"
              variants={loadingVariants}
              initial="start"
              animate="end"
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </div>
        )}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium text-foreground"
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};