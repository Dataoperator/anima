import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { DimensionalStateImpl } from '@/quantum/dimensional_state';
import { MemorySystem } from '@/memory/memory';
import { GrowthSystem } from '@/growth/growth_system';
import { Memory } from '@/memory/types';
import { GrowthMetrics } from '@/growth/types';

interface AnimaContextType {
  dimensionalState: DimensionalStateImpl;
  memorySystem: MemorySystem;
  growthSystem: GrowthSystem;
  quantumSignature: string;
  evolutionFactor: number;
  recentMemories: Memory[];
  growthMetrics: GrowthMetrics;
  processInteraction: (strength: number) => Promise<void>;
  syncQuantumState: () => Promise<void>;
  createMemory: (description: string, importance: number, keywords?: string[]) => void;
}

const AnimaContext = createContext<AnimaContextType | null>(null);

export function AnimaProvider({ children }: { children: React.ReactNode }) {
  const { principal, quantumState } = useAuth();
  const [dimensionalState] = useState(() => new DimensionalStateImpl());
  const [memorySystem] = useState(() => new MemorySystem());
  const [growthSystem] = useState(() => new GrowthSystem());
  const [quantumSignature, setQuantumSignature] = useState('');
  const [evolutionFactor, setEvolutionFactor] = useState(0);
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics>(() => growthSystem.getMetrics());

  // Initialize ANIMA systems when quantum state changes
  useEffect(() => {
    if (quantumState && principal) {
      initializeAnimaSystems();
    }
  }, [quantumState, principal]);

  const initializeAnimaSystems = async () => {
    try {
      console.log('🧬 Initializing ANIMA systems...');
      
      // Initialize dimensional state with quantum alignment
      dimensionalState.quantumAlignment = quantumState?.coherence || 1.0;

      // Generate quantum signature
      const signature = generateQuantumSignature();
      setQuantumSignature(signature);

      // Calculate evolution factor
      const evolution = calculateEvolutionFactor();
      setEvolutionFactor(evolution);

      // Update recent memories
      updateRecentMemories();

      console.log('✨ ANIMA systems initialized');
    } catch (error) {
      console.error('Failed to initialize ANIMA systems:', error);
    }
  };

  const processInteraction = async (strength: number) => {
    try {
      // Update dimensional state
      dimensionalState.updateStability(strength);

      // Process growth event
      await growthSystem.processGrowthEvent({
        strength,
        quantum_state: quantumState!,
        dimensional_state: dimensionalState
      });

      // Create memory if significant
      if (strength > 0.5) {
        createMemory(
          `Significant quantum interaction (${strength.toFixed(2)})`,
          strength,
          ['quantum', 'interaction']
        );
      }

      // Update states
      setGrowthMetrics(growthSystem.getMetrics());
      updateRecentMemories();
      
      // Generate new quantum signature
      const newSignature = generateQuantumSignature();
      setQuantumSignature(newSignature);

      // Update evolution factor
      const newEvolution = calculateEvolutionFactor();
      setEvolutionFactor(newEvolution);

    } catch (error) {
      console.error('Failed to process interaction:', error);
    }
  };

  const syncQuantumState = async () => {
    try {
      const resonance = dimensionalState.calculateResonance();
      const stability = dimensionalState.getStabilityMetrics();
      
      // Update quantum state if it exists
      if (quantumState) {
        quantumState.resonanceMetrics.fieldStrength = resonance;
        quantumState.coherence = stability[0];
        quantumState.phaseAlignment = stability[1];
      }

    } catch (error) {
      console.error('Failed to sync quantum state:', error);
    }
  };

  const createMemory = (description: string, importance: number, keywords: string[] = []) => {
    const memory = memorySystem.createMemory(description, importance, keywords, quantumState);
    updateRecentMemories();
    return memory;
  };

  const updateRecentMemories = () => {
    setRecentMemories(memorySystem.getRecentMemories(5));
  };

  // Helper functions
  const generateQuantumSignature = (): string => {
    const timestamp = Date.now();
    const resonance = dimensionalState.resonance.toFixed(4);
    const coherence = dimensionalState.phaseCoherence.toFixed(4);
    return `QS-${resonance}-${coherence}-${timestamp}`;
  };

  const calculateEvolutionFactor = (): number => {
    const resonance = dimensionalState.resonance;
    const coherence = dimensionalState.phaseCoherence;
    const stability = dimensionalState.stability;
    const memoryResonance = memorySystem.calculateResonance(quantumState!);
    
    return (resonance + coherence + stability + memoryResonance) / 4;
  };

  const contextValue = {
    dimensionalState,
    memorySystem,
    growthSystem,
    quantumSignature,
    evolutionFactor,
    recentMemories,
    growthMetrics,
    processInteraction,
    syncQuantumState,
    createMemory
  };

  return (
    <AnimaContext.Provider value={contextValue}>
      {children}
    </AnimaContext.Provider>
  );
}

export function useAnima() {
  const context = useContext(AnimaContext);
  if (!context) {
    throw new Error('useAnima must be used within an AnimaProvider');
  }
  return context;
}