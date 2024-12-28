import React from 'react';
import { motion } from 'framer-motion';

export const NeuralGrid = () => {
  const nodes = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    connections: [],
  }));

  // Generate connections
  nodes.forEach(node => {
    const numConnections = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numConnections; i++) {
      const target = nodes[Math.floor(Math.random() * nodes.length)];
      if (target.id !== node.id) {
        node.connections.push(target);
      }
    }
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%">
        {nodes.map(node => (
          <React.Fragment key={node.id}>
            {node.connections.map((target, i) => (
              <motion.line
                key={`${node.id}-${target.id}-${i}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="#2081E2"
                strokeWidth="0.5"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: [0, 1],
                  strokeOpacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2,
                }}
              />
            ))}
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="2"
              fill="#2081E2"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2,
              }}
            />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};