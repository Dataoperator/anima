import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { canisterId as animaCanisterId } from '../declarations/anima';
import { II_CONFIG } from '../ii-config';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authClient: AuthClient | null;
  identity: any | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  authClient: null,
  identity: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<any | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create({
        idleOptions: {
          disableDefaultIdleCallback: true,
          disableIdle: true
        }
      });
      
      const isAuthenticated = await client.isAuthenticated();
      setAuthClient(client);
      setIsAuthenticated(isAuthenticated);
      
      if (isAuthenticated) {
        setIdentity(client.getIdentity());
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
    }
  };

  const login = async () => {
    try {
      const success = await authClient?.login({
        identityProvider: II_CONFIG.derivationOrigin,
        onSuccess: () => {
          setIsAuthenticated(true);
          const identity = authClient.getIdentity();
          setIdentity(identity);
        },
        derivationOrigin: II_CONFIG.derivationOrigin,
        maxTimeToLive: II_CONFIG.maxTimeToLive,
      });
      
      if (!success) {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authClient?.logout();
      setIsAuthenticated(false);
      setIdentity(null);
    } catch (err) {
      console.error('Logout failed:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, authClient, identity }}>
      {children}
    </AuthContext.Provider>
  );
};
