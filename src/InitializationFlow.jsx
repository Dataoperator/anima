import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './components/AuthProvider';
import { RecentlyConnected } from './components/RecentlyConnected';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.4 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const InitializationFlow = () => {
  const { login, recentConnections, shouldAutoConnect, toggleAutoConnect } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await login();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRecentConnect = async (principal) => {
    setIsConnecting(true);
    try {
      await login();
    } catch (error) {
      console.error('Recent connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-[calc(var(--vh,1vh)*100)] flex flex-col items-center justify-center p-6 bg-background"
    >
      <motion.div 
        variants={itemVariants}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-foreground"
          >
            Welcome to Anima
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground"
          >
            Your digital companion awaits
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="space-y-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isConnecting}
            onClick={handleConnect}
            className={`w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors
              ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              <span>Connect with Internet Identity</span>
            )}
          </motion.button>

          <RecentlyConnected 
            connections={recentConnections}
            onConnect={handleRecentConnect}
          />

          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
          >
            <input
              type="checkbox"
              id="autoConnect"
              checked={shouldAutoConnect}
              onChange={toggleAutoConnect}
              className="rounded border-muted"
            />
            <label htmlFor="autoConnect">
              Remember and auto-connect next time
            </label>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          <p>
            Your Anima is a unique digital companion powered by the Internet Computer.
            <br />
            Connect securely using Internet Identity to begin your journey.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};