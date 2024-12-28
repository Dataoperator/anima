import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export const InitializationCheck = () => {
  const { actor, identity } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkInitialization = async () => {
      if (!actor || !identity) {
        console.error('No actor or identity');
        navigate('/login');
        return;
      }

      try {
        console.log('Checking initialization...');
        const state = await actor.get_user_state([]);
        console.log('User state:', state);

        if ('Initialized' in state) {
          const animaId = state.Initialized.anima_id.toString();
          navigate(`/anima/${animaId}`);
        } else {
          const payment = await actor.initiate_payment({ Creation: null }, []);
          console.log('Payment initiated:', payment);
          
          if ('Ok' in payment) {
            navigate('/mint');
          } else {
            console.error('Payment initiation failed:', payment.Err);
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Initialization check failed:', error);
        navigate('/login');
      }
    };

    checkInitialization();
  }, [actor, identity, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#2081E2] border-t-transparent rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl text-white">Initializing your Living NFT...</h2>
      </motion.div>
    </div>
  );
};