import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Principal } from '@dfinity/principal';

export interface AnimaState {
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
  const { authClient, isAuthenticated } = useAuth();
  const [animas, setAnimas] = useState<AnimaState[]>([]);
  const [activeAnima, setActiveAnima] = useState<AnimaState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AnimaError | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchUserAnimas = useCallback(async () => {
    if (!authClient || !isAuthenticated) {
      setAnimas([]);
      return [];
    }
    
    try {
      setLoading(true);
      console.log('📡 Fetching animas');
      
      // Mock data - will be replaced with actual IC calls
      const mockAnimas: AnimaState[] = [];
      
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
      return [];
    } finally {
      setLoading(false);
    }
  }, [authClient, isAuthenticated, activeAnima]);

  const getAnima = useCallback(async (id: string): Promise<AnimaState | null> => {
    if (!authClient || !isAuthenticated) return null;
    
    try {
      console.log('🔍 Fetching anima details for ID:', id);
      // Mock data - replace with actual IC call
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
  }, [authClient, isAuthenticated]);

  const createAnima = useCallback(async (name: string): Promise<string | null> => {
    if (!authClient || !isAuthenticated) return null;
    
    try {
      setLoading(true);
      console.log('🎨 Creating new anima with name:', name);
      
      // Mock creation - replace with actual IC call
      const newId = Date.now().toString();
      const newAnima: AnimaState = {
        id: newId,
        designation: name,
        genesisTraits: ['Quantum Resonance', 'Neural Enhancement'],
        edition: 'Genesis',
        energyLevel: 100
      };
      
      setAnimas(prev => [...prev, newAnima]);
      setActiveAnima(newAnima);
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
  }, [authClient, isAuthenticated]);

  // Auto-fetch animas when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🚀 Auth confirmed, fetching animas...');
      fetchUserAnimas();
    } else {
      console.log('🔒 Not authenticated, clearing animas...');
      setAnimas([]);
      setActiveAnima(null);
    }
  }, [isAuthenticated, fetchUserAnimas]);

  return {
    animas: animas || [], // Ensure we never return undefined
    activeAnima,
    loading,
    error,
    clearError,
    fetchUserAnimas,
    getAnima,
    createAnima
  };
};