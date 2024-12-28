import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export const InitializationCheck = () => {
  const { actor, identity, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkInitialization = async () => {
      if (!isAuthenticated) {
        navigate('/', { replace: true });
        return;
      }

      if (!actor || !identity) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const principal = identity.getPrincipal();
        console.log('Checking initialization for principal:', principal.toString());
        
        const state = await actor.get_user_state([]);
        console.log('User state:', state);

        if ('Initialized' in state) {
          navigate(`/anima/${state.Initialized.anima_id.toString()}`);
        } else {
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
  }, [actor, identity, navigate, isAuthenticated]);

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
          Checking your Living NFT status...
        </p>
      </div>
    </div>
  );
};