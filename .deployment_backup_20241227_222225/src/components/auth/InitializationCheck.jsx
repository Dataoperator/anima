import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { checkActorMethods, verifyActorHealth } from '@/utils/actorVerification';
import logger from '@/utils/logging';

const TIMEOUT_DURATION = 30000;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 3000;
const CONNECTION_CHECK_INTERVAL = 2000;

const DEFAULT_STATUS = {
  phase: 'initializing',
  message: 'Initializing...',
  details: null,
  progress: 0,
  healthStatus: null
};

export const InitializationCheck = () => {
  const { actor, identity, setError, checkAuth, diagnostics } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [attempt, setAttempt] = useState(0);
  const [connectionChecks, setConnectionChecks] = useState(0);

  const updateStatus = useCallback((phase, message, details = null, progress = 0, healthStatus = null) => {
    setStatus(prevStatus => ({
      ...prevStatus,
      phase,
      message,
      details,
      progress,
      healthStatus: healthStatus || prevStatus.healthStatus
    }));

    logger.info('initialization', `Status update: ${phase}`, {
      message,
      details,
      progress,
      healthStatus
    });
  }, []);

  const verifyConnection = useCallback(async () => {
    if (!actor) {
      logger.warn('initialization', 'Verification failed: No actor available');
      return false;
    }
    
    try {
      const health = await verifyActorHealth(actor, identity);
      updateStatus(status.phase, status.message, status.details, status.progress, health);
      
      return Object.values(health).filter(v => typeof v === 'boolean').every(v => v);
    } catch (error) {
      logger.error('initialization', 'Connection verification failed', { error });
      return false;
    }
  }, [actor, identity, status, updateStatus]);

  const checkInitialization = useCallback(async () => {
    logger.info('initialization', 'Starting initialization check', { attempt });

    if (!actor || !identity) {
      updateStatus('auth', 'Reconnecting to Internet Computer...', 'Attempting to restore session');
      await checkAuth();
      return false;
    }

    try {
      // Verify actor and connection
      updateStatus('verification', 'Verifying canister connection...', 'Checking required methods', 20);
      const health = await verifyActorHealth(actor, identity);
      
      if (!Object.values(health).filter(v => typeof v === 'boolean').every(v => v)) {
        throw new Error('Actor health check failed');
      }

      // Check user state
      updateStatus('state', 'Checking user state...', 'Retrieving initialization status', 40, health);
      const state = await actor.get_user_state([]);
      
      if ('Initialized' in state) {
        const animaId = state.Initialized.anima_id.toString();
        updateStatus('complete', 'Initialization complete!', 'Redirecting to your Anima', 100, health);
        logger.info('initialization', 'User already initialized', { animaId });
        navigate(`/anima/${animaId}`);
        return true;
      }

      // Initialize payment
      updateStatus('payment', 'Setting up payment...', 'Initializing creation process', 60, health);
      const paymentResult = await actor.initiate_payment({ Creation: null }, []);
      
      if ('Ok' in paymentResult) {
        updateStatus('complete', 'Payment initiated!', 'Redirecting to minting page', 100, health);
        logger.info('initialization', 'Payment initiated successfully');
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
      logger.error('initialization', 'Initialization check failed', {
        error,
        attempt,
        connectionChecks,
        diagnostics
      });
      throw error;
    }
  }, [actor, identity, navigate, checkAuth, attempt, connectionChecks, diagnostics, updateStatus]);

  const performConnectionCheck = useCallback(async () => {
    setConnectionChecks(prev => prev + 1);
    return await verifyConnection();
  }, [verifyConnection]);

  useEffect(() => {
    let timeoutId;
    let retryTimeoutId;
    let connectionCheckInterval;

    const attemptInitialization = async () => {
      logger.info('initialization', 'Starting initialization attempt', { attempt });

      timeoutId = setTimeout(() => {
        if (attempt < RETRY_ATTEMPTS) {
          updateStatus('retry', `Retrying initialization...`, `Attempt ${attempt + 1} of ${RETRY_ATTEMPTS}`);
          setAttempt(prev => prev + 1);
        } else {
          const finalError = `Initialization timed out after ${RETRY_ATTEMPTS} attempts`;
          logger.error('initialization', finalError);
          setError(finalError);
          updateStatus('error', finalError, 'Please refresh the page to try again');
          navigate('/');
        }
      }, TIMEOUT_DURATION);

      try {
        connectionCheckInterval = setInterval(performConnectionCheck, CONNECTION_CHECK_INTERVAL);

        const success = await checkInitialization();
        if (success) {
          clearTimeout(timeoutId);
          clearInterval(connectionCheckInterval);
          return;
        }

        if (attempt < RETRY_ATTEMPTS) {
          retryTimeoutId = setTimeout(() => {
            setAttempt(prev => prev + 1);
          }, RETRY_DELAY);
        } else {
          setError('Maximum retry attempts reached');
          navigate('/');
        }
      } catch (error) {
        if (attempt < RETRY_ATTEMPTS) {
          retryTimeoutId = setTimeout(() => {
            setAttempt(prev => prev + 1);
          }, RETRY_DELAY);
        } else {
          setError(error.message);
          navigate('/');
        }
      } finally {
        clearInterval(connectionCheckInterval);
      }
    };

    attemptInitialization();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(retryTimeoutId);
      clearInterval(connectionCheckInterval);
    };
  }, [attempt, checkInitialization, navigate, setError, performConnectionCheck, updateStatus]);

  const renderHealthStatus = () => {
    if (!status.healthStatus) return null;

    return (
      <div className="mt-4 text-xs">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(status.healthStatus)
            .filter(([key]) => typeof status.healthStatus[key] === 'boolean')
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-1 bg-gray-700/50 rounded">
                <span className="text-gray-300 capitalize">{key}</span>
                <span className={value ? 'text-green-400' : 'text-red-400'}>
                  {value ? '✓' : '✗'}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 rounded-lg bg-gray-800 shadow-xl max-w-md w-full mx-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-white mb-4">
          Initializing Living NFT
        </h2>
        <div className="space-y-4">
          <p className="text-blue-400">{status.message}</p>
          {status.details && (
            <p className="text-sm text-gray-400">{status.details}</p>
          )}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${status.progress}%` }}
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            />
          </div>
          {renderHealthStatus()}
          {attempt > 0 && (
            <p className="text-xs text-gray-500">
              Attempt {attempt + 1} of {RETRY_ATTEMPTS}
            </p>
          )}
          {logger.getDiagnostics().errors?.lastError && (
            <div className="mt-4 p-3 bg-red-900/20 rounded text-left">
              <p className="text-xs text-red-400">Last Error:</p>
              <p className="text-xs text-red-300">
                {logger.getDiagnostics().errors.lastError.message}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};