import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export const InitializationCheck = () => {
  const { actor, identity } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkInitialization = async () => {
      if (!actor || !identity) {
        if (retryCount >= 5) {
          console.error('Failed to get actor or identity after retries');
          navigate('/mint');
          return;
        }
        setTimeout(() => setRetryCount(prev => prev + 1), 1000);
        return;
      }

      try {
        const principal = identity.getPrincipal();
        console.log('Checking initialization for principal:', principal.toString());
        // Pass principal as optional parameter
        const state = await actor.get_user_state(principal);
        console.log('User state:', state);

        if (state && state.Initialized) {
          // Convert principal to string for routing
          const animaId = state.Initialized.anima_id.toString();
          await new Promise(resolve => setTimeout(resolve, 500));
          navigate(`/anima/${animaId}`);
        } else {
          await new Promise(resolve => setTimeout(resolve, 500));
          navigate('/mint');
        }
      } catch (error) {
        console.error('Failed to check initialization:', error);
        navigate('/mint');
      } finally {
        setIsChecking(false);
      }
    };

    checkInitialization();
  }, [actor, identity, navigate, retryCount]);

  if (!isChecking) return null;

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
        <p className="mt-4 text-[#2081E2]">
          {retryCount > 0 
            ? `Connecting to Internet Computer... (Attempt ${retryCount}/5)`
            : 'Checking your Living NFT status...'}
        </p>
      </div>
    </div>
  );
};