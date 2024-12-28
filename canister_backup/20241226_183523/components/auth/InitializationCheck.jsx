import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const TIMEOUT_DURATION = 15000; // 15 seconds timeout

export const InitializationCheck = () => {
  const { actor, identity, setError } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Checking initialization...');

  useEffect(() => {
    const checkInitialization = async () => {
      if (!actor || !identity) {
        console.error('No actor or identity');
        setError('Authentication required');
        navigate('/');
        return;
      }

      // Set up timeout
      const timeout = setTimeout(() => {
        setError('Initialization timed out. Please try again.');
        navigate('/');
      }, TIMEOUT_DURATION);

      try {
        // Verify actor has required methods
        const requiredMethods = ['get_user_state', 'initiate_payment'];
        const missingMethods = requiredMethods.filter(method => !(method in actor));
        
        if (missingMethods.length > 0) {
          throw new Error(`Actor missing required methods: ${missingMethods.join(', ')}`);
        }

        setStatus('Checking user state...');
        const state = await actor.get_user_state([]);
        console.log('User state:', state);

        if ('Initialized' in state) {
          const animaId = state.Initialized.anima_id.toString();
          clearTimeout(timeout);
          navigate(`/anima/${animaId}`);
          return;
        }

        setStatus('Initiating payment...');
        const paymentResult = await actor.initiate_payment({ Creation: null }, []);
        console.log('Payment result:', paymentResult);

        if ('Ok' in paymentResult) {
          clearTimeout(timeout);
          navigate('/mint');
        } else {
          throw new Error(paymentResult.Err || 'Payment initiation failed');
        }
      } catch (error) {
        console.error('Initialization failed:', error);
        setError(error.message || 'Initialization failed');
        navigate('/');
      } finally {
        clearTimeout(timeout);
      }
    };

    checkInitialization();
  }, [actor, identity, navigate, setError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 rounded-lg bg-gray-800 shadow-xl"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-white mb-4">
          Initializing Living NFT
        </h2>
        <p className="text-blue-400">{status}</p>
      </motion.div>
    </div>
  );
};