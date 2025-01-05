import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { icManager } from '@/ic-init';
import { LoadingFallback } from '../ui/LoadingFallback';

const AuthError = ({ error, onRetry }: { error: any, onRetry: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-black relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1)_1px,_transparent_1px)] bg-[length:40px_40px]" />
    
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full p-6 bg-black/40 backdrop-blur-lg border border-red-500/30 rounded-lg text-red-400">
        <motion.div
          animate={{
            textShadow: ['0 0 8px rgba(255,0,0,0.5)', '0 0 12px rgba(255,0,0,0.8)', '0 0 8px rgba(255,0,0,0.5)'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-xl font-mono mb-4"
        >
          NEURAL LINK ERROR
        </motion.div>

        <div className="space-y-4">
          <p className="font-mono text-sm leading-relaxed">
            {error?.message || 'Neural interface synchronization failed'}
          </p>
          {error?.details && (
            <div className="text-xs font-mono opacity-70 bg-red-900/20 p-2 rounded">
              <pre>{JSON.stringify(error.details, null, 2)}</pre>
            </div>
          )}
          <div className="text-xs font-mono opacity-70 mt-4">
            <div>Window IC Status: {window.ic ? 'Present' : 'Missing'}</div>
            <div>Canister Status: {window.canister ? 'Present' : 'Missing'}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs opacity-70">
              Error Code: {error?.code || 'UNKNOWN'}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded text-sm font-mono
                        hover:bg-red-500/20 transition-colors duration-200"
            >
              RETRY NEURAL LINK
            </motion.button>
          </div>
        </div>
      </div>
    </div>

    <motion.div
      className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent mix-blend-overlay"
      animate={{
        opacity: [0, 0.2, 0],
      }}
      transition={{
        duration: 0.2,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: "steps(1)",
      }}
    />
  </motion.div>
);

export const AuthGuard = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('🔍 AuthGuard initializing...');
    console.log('Current window.ic status:', {
      hasIC: !!window.ic,
      hasCanister: !!window.canister,
      location: location.pathname
    });

    const initialize = async () => {
      try {
        // Check if we're already initialized
        if (icManager.isInitialized()) {
          console.log('✅ IC already initialized');
          const identity = icManager.getIdentity();
          handleIdentity(identity);
          return;
        }

        await icManager.initialize();
        
        // Get identity after initialization
        const identity = icManager.getIdentity();
        console.log('✅ Identity initialized:', identity?.getPrincipal().toText());
        handleIdentity(identity);

      } catch (err) {
        console.error('❌ Auth initialization failed:', err);
        setError(err instanceof Error ? err : new Error('Authentication failed'));
        setIsInitializing(false);
      }
    };

    const handleIdentity = (identity: any) => {
      if (!identity && location.pathname !== '/') {
        console.log('🚫 No identity, redirecting to landing page');
        navigate('/', { 
          replace: true,
          state: { returnTo: location.pathname }
        });
        return;
      }

      if (identity && location.pathname === '/') {
        console.log('✅ Has identity on landing page, redirecting to quantum vault');
        const returnTo = location.state?.returnTo || '/quantum-vault';
        navigate(returnTo, { replace: true });
      }

      setIsInitializing(false);
    };

    initialize();
  }, [navigate, location]);

  const handleRetry = async () => {
    console.log('🔄 Retrying initialization...');
    setIsInitializing(true);
    setError(null);
    
    try {
      await icManager.initialize();
      const identity = icManager.getIdentity();
      
      if (identity) {
        navigate('/quantum-vault', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('❌ Retry failed:', err);
      setError(err instanceof Error ? err : new Error('Authentication failed'));
    } finally {
      setIsInitializing(false);
    }
  };

  if (isInitializing) {
    return <LoadingFallback />;
  }

  if (error) {
    return <AuthError error={error} onRetry={handleRetry} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-black"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};