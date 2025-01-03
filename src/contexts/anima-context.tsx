import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './auth-context';
import { getAnimaActor } from '@/services/anima';
import type { AnimaToken } from '@/declarations/anima/anima.did';

interface AnimaContextType {
  selectedAnima: AnimaToken | null;
  setSelectedAnima: (anima: AnimaToken | null) => void;
  loading: boolean;
  error: string | null;
  fetchAnima: (id: string) => Promise<void>;
}

const AnimaContext = createContext<AnimaContextType>({
  selectedAnima: null,
  setSelectedAnima: () => {},
  loading: false,
  error: null,
  fetchAnima: async () => {},
});

export const useAnima = () => useContext(AnimaContext);

export const AnimaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { identity } = useAuth();
  const [selectedAnima, setSelectedAnima] = useState<AnimaToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnima = useCallback(async (id: string) => {
    try {
      if (!identity) {
        throw new Error('Authentication required');
      }

      setLoading(true);
      setError(null);

      const actor = await getAnimaActor(identity);
      const result = await actor.get_anima(BigInt(id));

      if (!result || result.length === 0) {
        throw new Error('Anima not found');
      }

      setSelectedAnima(result[0]);
    } catch (err: any) {
      console.error('Error fetching anima:', err);
      setError(err.message || 'Failed to fetch anima');
      setSelectedAnima(null);
    } finally {
      setLoading(false);
    }
  }, [identity]);

  useEffect(() => {
    if (!identity) {
      setSelectedAnima(null);
    }
  }, [identity]);

  return (
    <AnimaContext.Provider
      value={{
        selectedAnima,
        setSelectedAnima,
        loading,
        error,
        fetchAnima,
      }}
    >
      {children}
    </AnimaContext.Provider>
  );
};