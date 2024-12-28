import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { canisterId as animaCanisterId } from '../declarations/anima';
import { II_CONFIG, II_URL } from '../ii-config';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authClient: AuthClient | null;
  identity: any | null;
  isInitializing: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  authClient: null,
  identity: null,
  isInitializing: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create({
        idleOptions: II_CONFIG.idleOptions
      });
      
      const isAuthenticated = await client.isAuthenticated();
      setAuthClient(client);
      setIsAuthenticated(isAuthenticated);
      
      if (isAuthenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  const login = async () => {
    try {
      const loginResult = await new Promise<boolean>((resolve) => {
        authClient?.login({
          identityProvider: II_URL,
          onSuccess: () => {
            const identity = authClient.getIdentity();
            setIdentity(identity);
            setIsAuthenticated(true);
            resolve(true);
          },
          onError: () => {
            resolve(false);
          }
        });
      });
      
      if (!loginResult) {
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
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      authClient, 
      identity,
      isInitializing 
    }}>
      {children}
    </AuthContext.Provider>
  );
};