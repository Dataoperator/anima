import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  authClient: AuthClient | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Create auth client
        const client = await AuthClient.create();
        setAuthClient(client);

        // Check if already authenticated
        const isAuthed = await client.isAuthenticated();
        setIsAuthenticated(isAuthed);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Still mark as initialized to prevent endless loading
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) throw new Error('Auth client not initialized');

    try {
      await authClient.login({
        identityProvider: process.env.II_URL || 'https://identity.ic0.app/#authorize',
        onSuccess: () => {
          setIsAuthenticated(true);
        },
        onError: (error) => {
          console.error('Login failed:', error);
          throw error;
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!authClient) throw new Error('Auth client not initialized');

    try {
      await authClient.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Don't render until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p>Initializing Authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        authClient,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};