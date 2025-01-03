import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Principal } from '@dfinity/principal';

interface AnimaState {
  id: string;
  designation: string;
  genesisTraits: string[];
  edition: string;
  energyLevel: number;
}

interface AnimaError {
  code: number;
  message: string;
}

export const useAnima = () => {
  const { actor, isAuthenticated } = useAuth();
  const [animas, setAnimas] = useState<AnimaState[]>([]);
  const [activeAnima, setActiveAnima] = useState<AnimaState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AnimaError | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchUserAnimas = useCallback(async () => {
    if (!actor || !isAuthenticated) return;
    
    try {
      setLoading(true);
      console.log('📡 Fetching animas');
      
      // For development/testing - replace with actual data later
      const mockAnimas: AnimaState[] = [
        {
          id: '1',
          designation: 'Alpha-1',
          genesisTraits: ['Quantum Resonance', 'Neural Enhancement'],
          edition: 'Genesis',
          energyLevel: 85
        },
        {
          id: '2',
          designation: 'Beta-7',
          genesisTraits: ['Dimensional Shift', 'Time Dilation'],
          edition: 'First Wave',
          energyLevel: 92
        }
      ];
      
      setAnimas(mockAnimas);
      if (mockAnimas.length > 0 && !activeAnima) {
        setActiveAnima(mockAnimas[0]);
      }
      return mockAnimas;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ Error fetching animas:', error);
      setError({
        code: 500,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [actor, isAuthenticated, activeAnima]);

  const getAnima = useCallback(async (id: string): Promise<AnimaState | null> => {
    if (!actor) return null;
    
    try {
      console.log('🔍 Fetching anima details for ID:', id);
      // Mock data for development
      const mockAnima: AnimaState = {
        id,
        designation: 'Alpha-' + id,
        genesisTraits: ['Quantum Resonance', 'Neural Enhancement'],
        edition: 'Genesis',
        energyLevel: 85
      };
      setActiveAnima(mockAnima);
      return mockAnima;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ Error fetching anima:', error);
      setError({
        code: 500,
        message: error.message
      });
      return null;
    }
  }, [actor]);

  const createAnima = useCallback(async (name: string): Promise<string | null> => {
    if (!actor || !isAuthenticated) return null;
    
    try {
      setLoading(true);
      console.log('🎨 Creating new anima with name:', name);
      // Mock creation for development
      const newId = Date.now().toString();
      await fetchUserAnimas();
      return newId;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ Error creating anima:', error);
      setError({
        code: 500,
        message: error.message
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [actor, isAuthenticated, fetchUserAnimas]);

  // Auto-fetch animas when authentication changes
  useEffect(() => {
    console.log('🔄 Auth state changed, checking for animas...');
    if (actor && isAuthenticated) {
      console.log('🚀 Initiating anima fetch...');
      fetchUserAnimas();
    }
  }, [actor, isAuthenticated, fetchUserAnimas]);

  return {
    animas,
    activeAnima,
    loading,
    error,
    clearError,
    fetchUserAnimas,
    getAnima,
    createAnima
  };
};