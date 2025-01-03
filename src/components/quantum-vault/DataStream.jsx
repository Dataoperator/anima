import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export const DataStream = ({ recentMemories, quantumState, emergentCount }) => {
  const streamRef = useRef();
  const controls = useAnimation();

  useEffect(() => {
    if (quantumState?.coherence > 0.8) {
      controls.start({
        opacity: 0.25,
        transition: { duration: 2 }
      });
    } else {
      controls.start({
        opacity: 0.15,
        transition: { duration: 1 }
      });
    }
  }, [quantumState?.coherence]);

  return (
    <motion.div
      ref={streamRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={controls}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-violet-500/10 to-transparent">
        {/* Dynamic Memory Streams */}
        {recentMemories?.map((memory, index) => (
          <motion.div
            key={`memory-${index}`}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${(index * 100) / (recentMemories.length || 1)}%`,
              background: `linear-gradient(
                90deg,
                rgba(124, 58, 237, ${Math.min(memory.coherence * 0.5, 0.3)}),
                rgba(99, 102, 241, ${Math.min(memory.resonance * 0.5, 0.3)})
              )`
            }}
            animate={{
              opacity: [0, 1, 0],
              x: ['0%', '100%'],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: index * 0.1,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}

        {/* Base Animation Layer */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`base-${i}`}
            className="absolute left-0 right-0 h-px bg-cyan-500/30"
            style={{ top: `${i * 7}%` }}
            animate={{
              opacity: [0, 1, 0],
              x: ['0%', '100%']
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Quantum State Indicators */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <StatusIndicator 
          label="Coherence"
          value={quantumState?.coherence || 0}
          color="cyan"
        />
        <StatusIndicator 
          label="Emergence"
          value={emergentCount || 0}
          color="violet"
          isCount
        />
      </div>
    </motion.div>
  );
};

const StatusIndicator = ({ label, value, color, isCount = false }) => {
  return (
    <motion.div
      className="flex items-center space-x-2 font-mono text-sm"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`h-2 w-2 rounded-full bg-${color}-500`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <span className={`text-${color}-400`}>
        {label}: {isCount ? value : `${(value * 100).toFixed(1)}%`}
      </span>
    </motion.div>
  );
};
