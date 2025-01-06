import { useCallback, useEffect, useState } from 'react';
import { icManager } from '@/ic-init';
import { Identity } from '@dfinity/principal';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const currentIdentity = icManager.getIdentity();
      const isAnonymous = currentIdentity?.getPrincipal().isAnonymous();
      setIsAuthenticated(!isAnonymous);
      setIdentity(currentIdentity);
    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication check failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await icManager.login();
      if (success) {
        const currentIdentity = icManager.getIdentity();
        setIdentity(currentIdentity);
        setIsAuthenticated(true);
        return true;
      }
      throw new Error('Login failed');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await icManager.logout();
      setIsAuthenticated(false);
      setIdentity(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    identity
  };
}

export default useAuth;