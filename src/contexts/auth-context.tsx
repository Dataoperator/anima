import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { ErrorTracker } from '@/error/quantum_error';

interface AuthContextType {
  authClient: AuthClient | null;
  isAuthenticated: boolean;
  identity: any;
  principal: Principal | null;
  isInitializing: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const II_URL = process.env.DFX_NETWORK === 'ic' 
  ? 'https://identity.ic0.app'
  : process.env.INTERNET_IDENTITY_URL;

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: II_URL,
    derivationOrigin: process.env.DFX_NETWORK === 'ic' 
      ? 'https://identity.ic0.app'
      : undefined,
    maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000_000_000)
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [errorTracker] = useState(() => new ErrorTracker());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        const client = await AuthClient.create(defaultOptions.createOptions);
        const isAuthenticated = await client.isAuthenticated();
        
        setAuthClient(client);
        setIsAuthenticated(isAuthenticated);
        
        if (isAuthenticated) {
          const identity = client.getIdentity();
          const principal = identity.getPrincipal();
          setIdentity(identity);
          setPrincipal(principal);
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        await errorTracker.trackError({
          errorType: 'AUTH_INIT',
          severity: 'HIGH',
          context: 'Authentication Initialization',
          error: error as Error
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    try {
      setIsInitializing(true);
      await authClient?.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          setIsAuthenticated(true);
          setIdentity(identity);
          setPrincipal(principal);
        }
      });
    } catch (error) {
      console.error('Login failed:', error);
      await errorTracker.trackError({
        errorType: 'AUTH_LOGIN',
        severity: 'HIGH',
        context: 'Login Attempt',
        error: error as Error
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const logout = async () => {
    try {
      await authClient?.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
    } catch (error) {
      console.error('Logout failed:', error);
      await errorTracker.trackError({
        errorType: 'AUTH_LOGOUT',
        severity: 'MEDIUM',
        context: 'Logout Attempt',
        error: error as Error
      });
    }
  };

  const contextValue = {
    authClient,
    isAuthenticated,
    identity,
    principal,
    isInitializing,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}