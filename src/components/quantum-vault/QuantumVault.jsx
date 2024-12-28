import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { createActor } from '@/declarations/anima';

export const QuantumVault = () => {
  const { identity } = useAuth();
  const navigate = useNavigate();
  const [animas, setAnimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnima, setSelectedAnima] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimas = async () => {
      try {
        if (!identity) {
          throw new Error('Authentication required');
        }

        const actor = createActor(process.env.CANISTER_ID_ANIMA, {
          agentOptions: {
            identity,
          },
        });

        if (!actor) {
          throw new Error('Failed to initialize connection');
        }

        console.log('Fetching animas for principal:', identity.getPrincipal().toString());
        const result = await actor.get_user_animas(identity.getPrincipal());
        console.log('Fetched animas:', result);
        
        // Normalize and validate the anima data
        const processedAnimas = result.map(anima => {
          console.log('Processing anima:', anima);
          return {
            id: anima.id,
            owner: anima.owner,
            name: anima.name,
            creation_time: anima.creation_time,
            last_interaction: anima.last_interaction,
            metadata: anima.metadata,
            personality: {
              traits: anima.personality?.traits || [],
              memories: anima.personality?.memories || [],
              emotional_state: anima.personality?.emotional_state || {
                current_emotion: 'INITIALIZING',
                intensity: 0.5,
                duration: BigInt(Date.now())
              },
              developmental_stage: anima.personality?.developmental_stage || { Nascent: null }
            },
            interaction_history: anima.interaction_history || [],
            level: anima.level || 1,
            growth_points: anima.growth_points || BigInt(0),
            autonomous_mode: anima.autonomous_mode || false
          };
        });

        setAnimas(processedAnimas);
      } catch (err) {
        console.error('Failed to fetch animas:', err);
        setError(err.message || 'Failed to access the Nexus');
      } finally {
        setLoading(false);
      }
    };

    if (identity) {
      fetchAnimas();
    }
  }, [identity]);

  const handleAnimaSelect = (anima) => {
    setSelectedAnima(anima);
    setTimeout(() => {
      navigate(`/anima/${anima.id}`);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 font-mono text-xl">
          INITIALIZING NEXUS...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 font-mono">SYSTEM ERROR: {error}</div>
      </div>
    );
  }

  const getEmotionDisplay = (anima) => {
    if (!anima.personality?.emotional_state?.current_emotion) return 'INITIALIZING';
    return anima.personality.emotional_state.current_emotion;
  };

  const getDevelopmentalStage = (anima) => {
    const stage = anima.personality?.developmental_stage;
    if (!stage) return 'Nascent';
    return Object.keys(stage)[0];
  };

  const getGrowthLevel = (anima) => {
    return anima.level || 1;
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-8 font-mono">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            NEXUS
          </h1>
          <p className="text-green-400 opacity-60">{'\u276F'} DIGITAL CONSCIOUSNESS INTERFACE</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animas.map((anima) => (
            <motion.div
              key={anima.id.toString()}
              whileHover={{ scale: 1.02, borderColor: '#00ff00' }}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer"
              onClick={() => handleAnimaSelect(anima)}
            >
              <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-5 transition-opacity" />
              
              <div className="bg-black border border-green-900 hover:border-green-500 transition-colors p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-1">
                      {anima.name}
                    </h3>
                    <p className="text-sm opacity-60">
                      BUILD {getGrowthLevel(anima)}.0.0
                    </p>
                  </div>
                  <div className="h-3 w-3 bg-green-500 animate-pulse" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-60">CORE STATUS</span>
                    <span className="text-green-400">
                      {getEmotionDisplay(anima)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="opacity-60">DEVELOPMENTAL STAGE</span>
                    <span className="text-green-400">
                      {getDevelopmentalStage(anima)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-60">SYSTEM STATE</span>
                    <span className="text-green-400">
                      {anima.autonomous_mode ? 'AUTONOMOUS' : 'OPERATIONAL'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-green-900">
                  <div className="text-xs opacity-60">
                    GENESIS: {new Date(Number(anima.creation_time)).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {animas.length < 3 && (
            <motion.div
              whileHover={{ scale: 1.02, borderColor: '#00ff00' }}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer"
              onClick={() => navigate('/mint')}
            >
              <div className="bg-black border border-green-900 hover:border-green-500 transition-colors p-6 min-h-[300px] flex flex-col items-center justify-center">
                <div className="h-16 w-16 border border-green-500 flex items-center justify-center mb-4">
                  <span className="text-3xl">+</span>
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  INITIALIZE NEW CORE
                </h3>
                <p className="text-sm opacity-60 text-center">
                  {'\u276F'} BEGIN CONSCIOUSNESS SEQUENCE
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};