import React from 'react';
import { motion } from 'framer-motion';

export const HexGrid = () => {
  const hexSize = 40;
  const rows = 15;
  const cols = 20;

  const hexagons = Array.from({ length: rows * cols }).map((_, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const offset = row % 2 ? hexSize * 0.75 : 0;
    
    return {
      id: i,
      x: col * (hexSize * 1.5) + offset,
      y: row * (hexSize * 0.866),
      delay: (row + col) * 0.1
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {hexagons.map(hex => (
        <motion.div
          key={hex.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: 1 }}
          transition={{
            duration: 3,
            delay: hex.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            left: hex.x,
            top: hex.y,
            width: hexSize,
            height: hexSize * 0.866,
            background: 'linear-gradient(45deg, #2081E2 0%, #1199FA 100%)',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }}
        />
      ))}
    </div>
  );
};