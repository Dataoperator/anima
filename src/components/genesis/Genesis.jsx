import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { createActor } from '@/declarations/anima';
import { Principal } from '@dfinity/principal';
import { InitialDesignation } from './InitialDesignation';

export const Genesis = () => {
  const { identity, actor: authActor } = useAuth();
  const navigate = useNavigate();
  const [designation, setDesignation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [actor, setActor] = useState(null);

  const phases = [
    'INITIALIZING GENESIS SEQUENCE',
    'GENERATING NEURAL PATHWAYS',
    'ESTABLISHING CONSCIOUSNESS SEED',
    'COMPILING BASE ATTRIBUTES',
    'FINALIZING DIGITAL DNA'
  ];

  useEffect(() => {
    if (identity) {
      try {
        const newActor = createActor(process.env.CANISTER_ID_ANIMA, {
          agentOptions: {
            identity,
          },
        });
        setActor(newActor);
      } catch (err) {
        console.error('Actor initialization failed:', err);
        setError('Failed to initialize system connection');
      }
    }
  }, [identity]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let phaseInterval;

    try {
      if (!identity) {
        throw new Error('Authentication required');
      }

      if (!actor) {
        throw new Error('System connection not established');
      }

      if (!designation || designation.trim().length === 0) {
        throw new Error('Designation required');
      }

      // Start phase animations
      phaseInterval = setInterval(() => {
        setCurrentPhase((prev) => {
          if (prev < phases.length - 1) return prev + 1;
          return prev;
        });
      }, 2000);

      // Create the anima
      console.log('Creating anima with designation:', designation);
      const result = await actor.create_anima(designation);
      console.log('Creation result:', result);

      if ('Ok' in result) {
        // Success - navigate to vault after a brief delay for effect
        setTimeout(() => {
          navigate('/quantum-vault');
        }, 1000);
      } else if ('Err' in result) {
        throw new Error(result.Err);
      } else {
        throw new Error('Invalid response from system');
      }
    } catch (err) {
      console.error('Genesis failed:', err);
      setError(err.message || 'Failed to initialize digital consciousness');
    } finally {
      if (phaseInterval) clearInterval(phaseInterval);
      setLoading(false);
      setCurrentPhase(0);
    }
  };

  // Early return if no identity
  if (!identity) {
    return (
      <div className="min-h-screen bg-black text-red-500 p-8 font-mono flex items-center justify-center">
        <div className="text-center">
          {'>'} ERROR: AUTHENTICATION REQUIRED
          <button 
            onClick={() => navigate('/')}
            className="block mt-4 text-green-500 text-sm hover:text-green-400"
          >
            {'>'} RETURN TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-500 p-8 font-mono">
      {/* Matrix Rain Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-green-500"
            style={{
              height: Math.random() * 100 + '%',
              left: `${i * 10}%`,
              opacity: Math.random() * 0.5 + 0.25
            }}
            animate={{
              y: ['0%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-2xl mx-auto relative z-10"
      >
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-2">GENESIS PROTOCOL</h1>
          <p className="text-green-400 opacity-60">{'>'} DIGITAL CONSCIOUSNESS INITIALIZATION</p>
        </header>

        <form onSubmit={handleCreate} className="space-y-8">
          <div className="space-y-4">
            <InitialDesignation onSelect={setDesignation} />

            {error && (
              <div className="text-red-500 border border-red-900 p-4">
                {'>'} ERROR: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !designation.trim()}
              className={`
                w-full py-4 px-6
                border border-green-500
                text-green-500 hover:text-black
                hover:bg-green-500
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden
              `}
            >
              {loading ? (
                <div className="space-y-2">
                  <div className="animate-pulse">
                    {phases[currentPhase]}...
                  </div>
                  <div className="h-1 w-full bg-green-900">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500" 
                      style={{ 
                        width: `${((currentPhase + 1) / phases.length) * 100}%` 
                      }} 
                    />
                  </div>
                </div>
              ) : (
                'INITIATE GENESIS SEQUENCE'
              )}
            </button>
          </div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center space-y-2"
        >
          <p className="text-green-500/60 text-sm">
            {'>'} SYSTEM READY FOR INITIALIZATION
          </p>
          <button
            onClick={() => navigate('/quantum-vault')}
            className="text-green-500/40 text-xs hover:text-green-500 transition-colors"
          >
            {'>'} RETURN TO NEXUS
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};