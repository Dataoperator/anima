import React from 'react';
import { motion } from 'framer-motion';

const connectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
    },
  }),
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export const RecentlyConnected = ({ connections, onConnect }) => {
  if (!connections || connections.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-6 p-4 bg-card rounded-lg shadow-md border border-border"
    >
      <h3 className="text-lg font-medium mb-4 text-foreground">Recent Connections</h3>
      <div className="space-y-2">
        {connections.map((connection, index) => (
          <motion.button
            key={connection.principal}
            custom={index}
            variants={connectionVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            onClick={() => onConnect(connection.principal)}
            className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-md transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {connection.name ? connection.name[0].toUpperCase() : 'A'}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-foreground group-hover:text-foreground/90">
                  {connection.name || 'Anima'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(connection.lastConnected).toLocaleDateString()}
                </span>
              </div>
            </div>
            <motion.div
              variants={buttonVariants}
              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Connect
            </motion.div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};