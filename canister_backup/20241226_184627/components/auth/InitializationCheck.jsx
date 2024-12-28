import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { checkActorMethods, getActorMethodStatus } from '@/utils/actorVerification';
import { logError } from '@/utils/errorReporting';

const TIMEOUT_DURATION = 15000;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000;

export const InitializationCheck = () => {
  const { actor, identity, setError, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Initializing...');
  const [attempt, setAttempt] = useState(0);
  const [lastError, setLastError] = useState(null);

  const verifyActor = useCallback(async () => {
    try {
      const methodStatus = await getActorMethodStatus(actor);
      if (!methodStatus.success) {
        throw new Error(`Actor verification failed: ${methodStatus.error}`);
      }
      return true;
    } catch (error) {
      setLastError(error);
      logError(error, { component: 'InitializationCheck', operation: 'verifyActor' });
      return false;
    }
  }, [actor]);

  const checkInitialization = useCallback(async () => {
    if (!actor || !identity) {
      setStatus('Reconnecting to Internet Computer...');
      await checkAuth();
      return false;
    }

    try {
      setStatus('Verifying canister connection...');
      const isVerified = await verifyActor();
      if (!isVerified) {
        throw new Error(lastError?.message || 'Canister verification failed');
      }

      setStatus('Checking user state...');
      const state = await actor.get_user_state([]);
      
      if ('Initialized' in state) {
        const animaId = state.Initialized.anima_id.toString();
        navigate(`/anima/${animaId}`);
        return true;
      }

      setStatus('Preparing payment...');
      const paymentResult = await actor.initiate_payment({ Creation: null }, []);
      
      if ('Ok' in paymentResult) {
        navigate('/mint');
        return true;
      } else {
        throw new Error(
          'Err' in paymentResult ? 
            `Payment failed: ${JSON.stringify(paymentResult.Err)}` : 
            'Payment initiation failed'
        );
      }
    } catch (error) {
      setLastError(error);
      logError(error, { 
        component: 'InitializationCheck',
        operation: 'checkInitialization',
        attempt: attempt + 1 
      });
      throw error;
    }
  }, [actor, identity, navigate, checkAuth, verifyActor, attempt, lastError]);

  useEffect(() => {
    let timeoutId;
    let retryTimeoutId;

    const attemptInitialization = async () => {
      timeoutId = setTimeout(() => {
        if (attempt < RETRY_ATTEMPTS) {
          setStatus(`Retrying... (Attempt ${attempt + 1}/${RETRY_ATTEMPTS})`);
          setAttempt(prev => prev + 1);
        } else {
          const finalError = lastError?.message || 'Initialization timed out';
          setError(finalError);
          logError(new Error(finalError), {
            component: 'InitializationCheck',
            operation: 'timeout',
            attempts: attempt
          });
          navigate('/');
        }
      }, TIMEOUT_DURATION);

      try {
        const success = await checkInitialization();
        if (success) {
          clearTimeout(timeoutId);
          return;
        }

        if (attempt < RETRY_ATTEMPTS) {
          retryTimeoutId = setTimeout(() => {
            setAttempt(prev => prev + 1);
          }, RETRY_DELAY);
        } else {
          const finalError = lastError?.message || 'Maximum retry attempts reached';
          setError(finalError);
          navigate('/');
        }
      } catch (error) {
        if (attempt < RETRY_ATTEMPTS) {
          retryTimeoutId = setTimeout(() => {
            setAttempt(prev => prev + 1);
          }, RETRY_DELAY);
        } else {
          setError(error.message || 'Initialization failed');
          navigate('/');
        }
      }
    };

    attemptInitialization();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(retryTimeoutId);
    };
  }, [attempt, checkInitialization, navigate, setError]);

  const progressPercentage = Math.min((attempt / RETRY_ATTEMPTS) * 100, 100);

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
        <p className="text-blue-400 mb-4">{status}</p>
        {attempt > 0 && (
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        {attempt > 0 && (
          <p className="text-sm text-gray-400">
            Attempt {attempt}/{RETRY_ATTEMPTS}
          </p>
        )}
        {lastError && (
          <p className="text-sm text-red-400 mt-2">
            Last error: {lastError.message}
          </p>
        )}
      </motion.div>
    </div>
  );
};