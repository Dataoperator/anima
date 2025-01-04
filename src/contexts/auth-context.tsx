import React, { createContext, useContext, useEffect, useState } from 'react';
import { icManager } from '@/ic-init';
import type { Identity } from '@dfinity/agent';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  principal: string | null;
  identity: Identity | null;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const clearError = () => setError(null);

  const safelyGetPrincipal = (identity: Identity | null): string | null => {
    if (!identity) return null;
    try {
      const principal = identity.getPrincipal();
      return principal ? principal.toString() : null;
    } catch (err) {
      console.error('Failed to get principal:', err);
      return null;
    }
  };

  const checkAuthentication = async () => {
    try {
      const currentIdentity = icManager.getIdentity();
      
      if (!currentIdentity) {
        setIsAuthenticated(false);
        setPrincipal(null);
        setIdentity(null);
        return false;
      }

      const principalId = safelyGetPrincipal(currentIdentity);
      const isAnonymous = currentIdentity.getPrincipal().isAnonymous();
      
      setIsAuthenticated(!isAnonymous);
      setPrincipal(principalId);
      setIdentity(currentIdentity);
      
      return !isAnonymous;
    } catch (err) {
      console.error('Auth check failed:', err);
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return checkAuthentication();
      }
      setError(err instanceof Error ? err.message : 'Authentication check failed');
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (!mounted) return;
      
      try {
        setIsLoading(true);
        await checkAuthentication();
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Authentication initialization failed');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      clearError();
      const success = await icManager.login();
      if (success) {
        const isAuth = await checkAuthentication();
        setIsAuthenticated(isAuth);
        return isAuth;
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

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();
      await icManager.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setIdentity(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Monitor connection status
  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    const checkConnection = async () => {
      if (!mounted) return;

      try {
        const identity = icManager.getIdentity();
        if (!identity) {
          throw new Error('Identity not found');
        }
        await checkAuthentication();
      } catch (err) {
        console.error('Connection check failed:', err);
        if (mounted) {
          setError('Connection lost. Please reload the page.');
        }
      }
    };

    interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const memoizedValue = React.useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      error,
      principal,
      identity,
      login,
      logout,
      clearError
    }),
    [isAuthenticated, isLoading, error, principal, identity]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-4">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};