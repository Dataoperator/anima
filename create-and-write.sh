#!/bin/bash

# Execute directory creation script
chmod +x create-full-structure.sh
./create-full-structure.sh

# Now create auth context
mkdir -p src/contexts
cat > src/contexts/AuthContext.jsx << 'EOL'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  async function initAuth() {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);

      const isAuthed = await client.isAuthenticated();
      setIsAuthenticated(isAuthed);

      if (isAuthed) {
        setIdentity(client.getIdentity());
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login() {
    try {
      if (!authClient) return;

      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => {
          setIsAuthenticated(true);
          setIdentity(authClient.getIdentity());
        },
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async function logout() {
    try {
      if (!authClient) return;
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const value = {
    isAuthenticated,
    identity,
    isLoading,
    login,
    logout
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
EOL

# Create AuthGuard component
mkdir -p src/components/auth
cat > src/components/auth/AuthGuard.jsx << 'EOL'
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { InitializationFlow } from '@/components/anima/InitializationFlow';

export function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <InitializationFlow>{children}</InitializationFlow>;
}
EOL

# Create InitializationFlow component
mkdir -p src/components/anima
cat > src/components/anima/InitializationFlow.jsx << 'EOL'
import React, { useEffect, useState } from 'react';
import { useAnima } from '@/hooks/useAnima';
import { CreateAnimaForm } from './CreateAnimaForm';

export function InitializationFlow({ children }) {
  const { anima, loading, error, checkInitialization } = useAnima();
  const [needsInit, setNeedsInit] = useState(true);

  useEffect(() => {
    const init = async () => {
      const initialized = await checkInitialization();
      setNeedsInit(!initialized);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing Anima...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (needsInit) {
    return <CreateAnimaForm />;
  }

  return children;
}
EOL

# Update App.jsx
cat > src/App.jsx << 'EOL'
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/auth/AuthGuard';
import { AnimaDashboard } from './components/AnimaDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthGuard>
          <AnimaDashboard />
        </AuthGuard>
      </AuthProvider>
    </Router>
  );
}
EOL

echo "All files created successfully!"