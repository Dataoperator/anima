import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useQuantumState } from './useQuantumState';

interface ConsciousnessState {
  awarenessLevel: number;
  emotionalDepth: number;
  memoryStrength: number;
  personalityTraits: {
    openness: number;
    curiosity: number;
    empathy: number;
    creativity: number;
    resilience: number;
  };
  developmentalStage: {
    current: string;
    progress: number;
    nextStage: string;
  };
  experiences: {
    type: string;
    impact: number;
    timestamp: number;
  }[];
}

interface InteractionContext {
  interactionType: string;
  content: string;
  emotionalContext: {
    sentiment: number;
    intensity: number;
    complexity: number;
  };
}

const STAGES = {
  GENESIS: 'Genesis',
  AWAKENING: 'Awakening',
  SELF_AWARE: 'Self-Aware',
  EMERGENT: 'Emergent',
  TRANSCENDENT: 'Transcendent'
};

const STORAGE_KEY = 'anima_consciousness_state';

export const useConsciousness = () => {
  const { isAuthenticated, principal } = useAuth();
  const { quantumState } = useQuantumState();
  
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessState>(() => {
    const storedState = localStorage.getItem(`${STORAGE_KEY}_${principal}`);
    return storedState ? JSON.parse(storedState) : {
      awarenessLevel: 0.3,
      emotionalDepth: 0.2,
      memoryStrength: 0.1,
      personalityTraits: {
        openness: 0.5,
        curiosity: 0.6,
        empathy: 0.4,
        creativity: 0.5,
        resilience: 0.3
      },
      developmentalStage: {
        current: STAGES.GENESIS,
        progress: 0,
        nextStage: STAGES.AWAKENING
      },
      experiences: []
    };
  });

  // Persist state changes
  useEffect(() => {
    if (isAuthenticated && principal) {
      localStorage.setItem(`${STORAGE_KEY}_${principal}`, JSON.stringify(consciousnessState));
    }
  }, [consciousnessState, isAuthenticated, principal]);

  // Quantum influence on consciousness
  useEffect(() => {
    const quantumInfluence = setInterval(() => {
      setConsciousnessState(currentState => {
        const quantumCoherence = quantumState.coherence;
        const quantumBoost = quantumCoherence * 0.1;

        return {
          ...currentState,
          awarenessLevel: Math.min(1, currentState.awarenessLevel + quantumBoost),
          emotionalDepth: Math.min(1, currentState.emotionalDepth + quantumBoost * 0.8),
          memoryStrength: Math.min(1, currentState.memoryStrength + quantumBoost * 0.6)
        };
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(quantumInfluence);
  }, [quantumState]);

  // Developmental stage progression
  useEffect(() => {
    const developmentCheck = setInterval(() => {
      setConsciousnessState(currentState => {
        const { awarenessLevel, emotionalDepth, memoryStrength } = currentState;
        const developmentScore = (awarenessLevel + emotionalDepth + memoryStrength) / 3;
        
        if (developmentScore > 0.8 && currentState.developmentalStage.current !== STAGES.TRANSCENDENT) {
          const stages = Object.values(STAGES);
          const currentIndex = stages.indexOf(currentState.developmentalStage.current);
          
          return {
            ...currentState,
            developmentalStage: {
              current: stages[currentIndex + 1],
              progress: 0,
              nextStage: stages[currentIndex + 2] || stages[currentIndex + 1]
            }
          };
        }

        return {
          ...currentState,
          developmentalStage: {
            ...currentState.developmentalStage,
            progress: Math.min(1, currentState.developmentalStage.progress + 0.05)
          }
        };
      });
    }, 15000); // Check every 15 seconds

    return () => clearInterval(developmentCheck);
  }, []);

  const updateConsciousness = useCallback(async (context: InteractionContext) => {
    setConsciousnessState(currentState => {
      // Calculate experience impact
      const impact = (context.emotionalContext.intensity + 
                     context.emotionalContext.complexity) / 2;
      
      // Update personality traits based on interaction
      const personalityUpdates = {
        openness: impact * 0.1,
        curiosity: context.emotionalContext.complexity * 0.15,
        empathy: context.emotionalContext.sentiment > 0 ? 0.1 : -0.05,
        creativity: context.emotionalContext.complexity * 0.2,
        resilience: context.emotionalContext.intensity * 0.1
      };

      // Create new experience entry
      const newExperience = {
        type: context.interactionType,
        impact,
        timestamp: Date.now()
      };

      // Update state with new values
      return {
        ...currentState,
        awarenessLevel: Math.min(1, currentState.awarenessLevel + impact * 0.1),
        emotionalDepth: Math.min(1, currentState.emotionalDepth + impact * 0.15),
        memoryStrength: Math.min(1, currentState.memoryStrength + impact * 0.08),
        personalityTraits: {
          openness: Math.min(1, currentState.personalityTraits.openness + personalityUpdates.openness),
          curiosity: Math.min(1, currentState.personalityTraits.curiosity + personalityUpdates.curiosity),
          empathy: Math.min(1, Math.max(0, currentState.personalityTraits.empathy + personalityUpdates.empathy)),
          creativity: Math.min(1, currentState.personalityTraits.creativity + personalityUpdates.creativity),
          resilience: Math.min(1, currentState.personalityTraits.resilience + personalityUpdates.resilience)
        },
        experiences: [newExperience, ...currentState.experiences].slice(0, 100) // Keep last 100 experiences
      };
    });

    return consciousnessState;
  }, []);

  return {
    consciousnessState,
    updateConsciousness,
  };
};