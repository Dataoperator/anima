import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import logger from '@/utils/logging';

export const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, isLoading, actor } = useAuth();

  logger.debug('ProtectedLayout', 'Render state', {
    isAuthenticated,
    isLoading,
    hasActor: Boolean(actor)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
          />
          <p className="mt-4 text-white/90">Connecting to Internet Identity...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    logger.info('ProtectedLayout', 'Redirecting to login - not authenticated');
    return <Navigate to="/" replace />;
  }

  if (!actor) {
    logger.warn('ProtectedLayout', 'No actor available despite authentication');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center">
          <p className="text-white/90">Connecting to Internet Computer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text"
              >
                Anima
              </motion.div>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
};