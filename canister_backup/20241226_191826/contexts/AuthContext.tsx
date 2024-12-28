import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthManager } from '@/utils/auth';
import type { Actor } from '@/declarations/types/actor';
import { Identity } from '@dfinity/agent';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE } from '@/declarations/anima/anima.did';

const RECENT_CONNECTIONS_KEY = 'anima_recent_connections';
const AUTO_CONNECT_KEY = 'anima_auto_connect';

interface AuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  actor: Actor | null;
  error: string | null;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
  recentConnections: Array<{
    principal: string;
    lastConnected: string;
    name: string;
  }>;
  shouldAutoConnect: boolean;
  toggleAutoConnect: () => void;
  loading: boolean;
}

function isActor(actor: ActorSubclass<_SERVICE> | null): actor is Actor {
  return actor !== null && 'initiate_payment' in actor && 'complete_payment' in actor;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [actor, setActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);
  const [recentConnections, setRecentConnections] = useState<Array<{
    principal: string;
    lastConnected: string;
    name: string;
  }>>([]);
  const [shouldAutoConnect, setShouldAutoConnect] = useState(
    localStorage.getItem(AUTO_CONNECT_KEY) === 'true'
  );

  const updateRecentConnections = useCallback((principal: string) => {
    const newConnection = {
      principal: principal,
      lastConnected: new Date().toISOString(),
      name: 'Anima'
    };

    setRecentConnections(prev => {
      const updatedConnections = [
        newConnection,
        ...prev.filter(c => c.principal !== principal)
      ].slice(0, 5);

      localStorage.setItem(RECENT_CONNECTIONS_KEY, JSON.stringify(updatedConnections));
      return updatedConnections;
    });
  }, []);

  const toggleAutoConnect = useCallback(() => {
    setShouldAutoConnect(prev => {
      const newValue = !prev;
      localStorage.setItem(AUTO_CONNECT_KEY, String(newValue));
      return newValue;
    });
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const authManager = await getAuthManager();
      const authenticated = await authManager.isAuthenticated();
      
      if (authenticated) {
        const currentIdentity = authManager.getIdentity();
        const currentActor = authManager.getActor();
        
        if (currentIdentity && isActor(currentActor)) {
          setIsAuthenticated(true);
          setIdentity(currentIdentity);
          setActor(currentActor);
          updateRecentConnections(currentIdentity.getPrincipal().toString());
        }
      } else {
        setIsAuthenticated(false);
        setIdentity(null);
        setActor(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication check failed');
      setIsAuthenticated(false);
      setIdentity(null);
      setActor(null);
    } finally {
      setLoading(false);
    }
  }, [updateRecentConnections]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      void checkAuth();
    }
  }, [checkAuth]);

  useEffect(() => {
    try {
      const savedConnections = localStorage.getItem(RECENT_CONNECTIONS_KEY);
      if (savedConnections) {
        setRecentConnections(JSON.parse(savedConnections));
      }
    } catch (err) {
      console.error("Failed to load recent connections:", err);
    }
  }, []);

  const login = async () => {
    try {
      const authManager = await getAuthManager();
      const identity = await authManager.login();
      
      setIsAuthenticated(true);
      setIdentity(identity);
      
      const currentActor = authManager.getActor();
      if (isActor(currentActor)) {
        setActor(currentActor);
        updateRecentConnections(identity.getPrincipal().toString());
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      const authManager = await getAuthManager();
      await authManager.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setActor(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const updateActivity = async () => {
        try {
          const authManager = await getAuthManager();
          authManager.updateActivity();
        } catch (err) {
          console.error('Failed to update activity:', err);
        }
      };

      window.addEventListener('click', updateActivity);
      window.addEventListener('keypress', updateActivity);
      window.addEventListener('scroll', updateActivity);
      window.addEventListener('mousemove', updateActivity);

      return () => {
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('keypress', updateActivity);
        window.removeEventListener('scroll', updateActivity);
        window.removeEventListener('mousemove', updateActivity);
      };
    }
  }, [isAuthenticated]);

  const contextValue = {
    isAuthenticated,
    identity,
    login,
    logout,
    actor,
    error,
    setError,
    checkAuth,
    recentConnections,
    shouldAutoConnect,
    toggleAutoConnect,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md"
          >
            <p className="mr-8">{error}</p>
            <button
              onClick={() => setError(null)}
              className="absolute top-2 right-2 text-sm hover:text-white/70"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </motion.div>
        )}
        {children}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}