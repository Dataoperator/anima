import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthProvider';

export const useAnima = () => {
  const { actor, identity } = useAuth();
  const [personality, setPersonality] = useState({
    traits: [],
    metrics: {},
    developmentStage: 'Initial'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnimaState = useCallback(async () => {
    if (!actor || !identity) return;

    try {
      const principal = identity.getPrincipal();
      const result = await actor.get_anima(principal);
      
      if ('Ok' in result) {
        const anima = result.Ok;
        setPersonality({
          traits: anima.personality.traits,
          metrics: {
            interactionCount: anima.personality.interaction_count,
            growthLevel: anima.personality.growth_level,
            developmentStage: anima.personality.developmental_stage,
            creationTime: anima.creation_time,
            lastInteraction: anima.last_interaction
          },
          developmentStage: anima.personality.developmental_stage
        });
      }
    } catch (err) {
      console.error('Failed to fetch Anima state:', err);
      setError('Failed to load Anima data');
    } finally {
      setIsLoading(false);
    }
  }, [actor, identity]);

  const updatePersonality = useCallback(async (updates) => {
    if (!actor || !identity) return;

    try {
      const principal = identity.getPrincipal();
      const currentState = await actor.get_anima(principal);
      
      if ('Ok' in currentState) {
        const updatedAnima = {
          ...currentState.Ok,
          personality: {
            ...currentState.Ok.personality,
            traits: updates
          }
        };
        
        setPersonality(prev => ({
          ...prev,
          traits: updates
        }));
      }
    } catch (err) {
      console.error('Failed to update personality:', err);
      setError('Failed to update Anima');
    }
  }, [actor, identity]);

  useEffect(() => {
    if (actor && identity) {
      fetchAnimaState();
    }
  }, [actor, identity, fetchAnimaState]);

  return {
    personality,
    isLoading,
    error,
    updatePersonality,
    refreshState: fetchAnimaState
  };
};

export default useAnima;