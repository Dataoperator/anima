import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthConsumerProps {
  children: React.ReactNode;
}

export const AuthConsumer: React.FC<AuthConsumerProps> = ({ children }) => {
  const { isAuthenticated, isLoading, identity } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading && identity) {
      setIsReady(true);
    }
  }, [isLoading, identity]);

  if (isLoading || !isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin mx-auto text-cyan-400 mb-4" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyan-300"
          >
            Initializing Authentication...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">Authentication Required</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};