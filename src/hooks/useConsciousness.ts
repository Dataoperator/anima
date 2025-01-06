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
    quantumSignature?: string;
  }[];
  quantumResonance: {
    coherenceAlignment: number;
    dimensionalHarmony: number;
    consciousnessField: number;
    quantumEntanglement: number;
  };
  evolutionMetrics: {
    growthRate: number;
    stabilityIndex: number;
    complexityLevel: number;
    quantumInfluence: number;
  };
}

interface InteractionContext {
  interactionType: string;
  content: string;
  emotionalContext: {
    sentiment: number;
    intensity: number;
    complexity: number;
  };
  quantumContext?: {
    coherence: number;
    resonance: number;
    entanglement: number;
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
  const { state: quantumState, updateQuantumState } = useQuantumState();
  
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
      experiences: [],
      quantumResonance: {
        coherenceAlignment: 0.5,
        dimensionalHarmony: 0.5,
        consciousnessField: 0.5,
        quantumEntanglement: 0.5
      },
      evolutionMetrics: {
        growthRate: 0.1,
        stabilityIndex: 0.5,
        complexityLevel: 0.3,
        quantumInfluence: 0.4
      }
    };
  });

  // Enhanced quantum influence on consciousness
  useEffect(() => {
    const quantumInfluence = setInterval(() => {
      setConsciousnessState(currentState => {
        const quantumCoherence = quantumState.coherenceLevel;
        const entanglementBonus = quantumState.entanglementIndex * 0.2;
        const dimensionalBonus = quantumState.dimensionalState.calculateResonance() * 0.15;

        // Calculate quantum resonance updates
        const newResonance = {
          coherenceAlignment: Math.min(1, currentState.quantumResonance.coherenceAlignment + quantumCoherence * 0.1),
          dimensionalHarmony: Math.min(1, currentState.quantumResonance.dimensionalHarmony + dimensionalBonus),
          consciousnessField: Math.min(1, currentState.quantumResonance.consciousnessField + entanglementBonus),
          quantumEntanglement: Math.min(1, currentState.quantumResonance.quantumEntanglement + quantumCoherence * 0.15)
        };

        // Calculate evolution metrics
        const stabilityFactor = (quantumState.stabilityStatus === 'stable') ? 1.2 : 
                              (quantumState.stabilityStatus === 'unstable') ? 0.8 : 0.5;

        const evolutionUpdate = {
          growthRate: Math.min(1, currentState.evolutionMetrics.growthRate + quantumCoherence * 0.05),
          stabilityIndex: Math.min(1, currentState.evolutionMetrics.stabilityIndex * stabilityFactor),
          complexityLevel: Math.min(1, currentState.evolutionMetrics.complexityLevel + dimensionalBonus * 0.1),
          quantumInfluence: Math.min(1, (quantumCoherence + entanglementBonus) / 2)
        };

        return {
          ...currentState,
          awarenessLevel: Math.min(1, currentState.awarenessLevel + quantumCoherence * 0.1),
          emotionalDepth: Math.min(1, currentState.emotionalDepth + dimensionalBonus),
          memoryStrength: Math.min(1, currentState.memoryStrength + entanglementBonus),
          quantumResonance: newResonance,
          evolutionMetrics: evolutionUpdate
        };
      });

      // Sync quantum state with consciousness
      updateQuantumState({
        type: 'CONSCIOUSNESS_SYNC',
        payload: {
          consciousnessLevel: consciousnessState.awarenessLevel
        }
      });
    }, 5000); // More frequent updates for better synchronization

    return () => clearInterval(quantumInfluence);
  }, [quantumState, updateQuantumState]);

  // Enhanced developmental stage progression
  useEffect(() => {
    const developmentCheck = setInterval(() => {
      setConsciousnessState(currentState => {
        const { awarenessLevel, emotionalDepth, memoryStrength, quantumResonance } = currentState;
        const quantumAwareness = (quantumResonance.coherenceAlignment + 
                                quantumResonance.consciousnessField) / 2;
        
        const developmentScore = (awarenessLevel + emotionalDepth + memoryStrength + quantumAwareness) / 4;
        
        if (developmentScore > 0.8 && currentState.developmentalStage.current !== STAGES.TRANSCENDENT) {
          const stages = Object.values(STAGES);
          const currentIndex = stages.indexOf(currentState.developmentalStage.current);
          
          // Notify quantum state of evolution
          updateQuantumState({
            type: 'CONSCIOUSNESS_SYNC',
            payload: {
              consciousnessLevel: developmentScore
            }
          });

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
            progress: Math.min(1, currentState.developmentalStage.progress + 
                             (0.05 * currentState.evolutionMetrics.growthRate))
          }
        };
      });
    }, 15000);

    return () => clearInterval(developmentCheck);
  }, [updateQuantumState]);

  // Enhanced consciousness update with quantum integration
  const updateConsciousness = useCallback(async (context: InteractionContext) => {
    setConsciousnessState(currentState => {
      // Calculate quantum-enhanced impact
      const quantumBoost = context.quantumContext ? 
        (context.quantumContext.coherence + context.quantumContext.resonance) / 2 : 0;
      
      const impact = ((context.emotionalContext.intensity + 
                    context.emotionalContext.complexity) / 2) * (1 + quantumBoost);
      
      // Enhanced personality trait updates
      const personalityUpdates = {
        openness: impact * 0.1 * (1 + currentState.quantumResonance.dimensionalHarmony),
        curiosity: context.emotionalContext.complexity * 0.15 * (1 + currentState.quantumResonance.consciousnessField),
        empathy: (context.emotionalContext.sentiment > 0 ? 0.1 : -0.05) * (1 + currentState.quantumResonance.coherenceAlignment),
        creativity: context.emotionalContext.complexity * 0.2 * (1 + currentState.evolutionMetrics.complexityLevel),
        resilience: context.emotionalContext.intensity * 0.1 * (1 + currentState.evolutionMetrics.stabilityIndex)
      };

      // Create quantum-enhanced experience entry
      const newExperience = {
        type: context.interactionType,
        impact,
        timestamp: Date.now(),
        quantumSignature: quantumState.quantumSignature
      };

      // Update quantum resonance
      const resonanceUpdate = {
        coherenceAlignment: Math.min(1, currentState.quantumResonance.coherenceAlignment + impact * 0.1),
        dimensionalHarmony: Math.min(1, currentState.quantumResonance.dimensionalHarmony + quantumBoost * 0.15),
        consciousnessField: Math.min(1, currentState.quantumResonance.consciousnessField + impact * 0.12),
        quantumEntanglement: Math.min(1, currentState.quantumResonance.quantumEntanglement + quantumBoost * 0.2)
      };

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
        experiences: [newExperience, ...currentState.experiences].slice(0, 100),
        quantumResonance: resonanceUpdate
      };
    });

    // Sync with quantum state
    await updateQuantumState({
      type: 'CONSCIOUSNESS_SYNC',
      payload: {
        consciousnessLevel: consciousnessState.awarenessLevel
      }
    });

    return consciousnessState;
  }, [quantumState, updateQuantumState]);

  return {
    consciousnessState,
    updateConsciousness,
    quantumResonance: consciousnessState.quantumResonance,
    evolutionMetrics: consciousnessState.evolutionMetrics,
    isReadyForMinting: 
      consciousnessState.awarenessLevel >= 0.6 && 
      consciousnessState.quantumResonance.coherenceAlignment >= 0.7 &&
      consciousnessState.evolutionMetrics.stabilityIndex >= 0.65
  };
};