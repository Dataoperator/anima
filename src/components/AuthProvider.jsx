import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authManager } from '../auth';
import { RecentlyConnected } from './RecentlyConnected';

const AuthContext = createContext(null);

const RECENT_CONNECTIONS_KEY = 'anima_recent_connections';
const AUTO_CONNECT_KEY = 'anima_auto_connect';

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState(authManager.getState());
  const [recentConnections, setRecentConnections] = useState([]);
  const [shouldAutoConnect, setShouldAutoConnect] = useState(
    localStorage.getItem(AUTO_CONNECT_KEY) === 'true'
  );

  // Load recent connections from localStorage
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

  // Initialize authentication
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        console.log("Initializing auth...");
        await authManager.initialize();
        
        if (isMounted) {
          const currentState = authManager.getState();
          setAuthState(currentState);
          console.log("Auth state:", currentState);

          // Auto-connect if enabled and we have recent connections
          if (shouldAutoConnect && recentConnections.length > 0 && !currentState.isAuthenticated) {
            await handleLogin();
          }
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Authentication failed');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [shouldAutoConnect]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authManager.login();
      const newState = authManager.getState();
      setAuthState(newState);

      if (newState.principal) {
        updateRecentConnections(newState.principal.toString());
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authManager.logout();
      setAuthState(authManager.getState());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecentConnections = (principal) => {
    const newConnection = {
      principal,
      lastConnected: new Date().toISOString(),
      name: 'Anima', // You can update this with actual name if available
    };

    const updatedConnections = [
      newConnection,
      ...recentConnections.filter(c => c.principal !== principal)
    ].slice(0, 5); // Keep only last 5 connections

    setRecentConnections(updatedConnections);
    localStorage.setItem(RECENT_CONNECTIONS_KEY, JSON.stringify(updatedConnections));
  };

  const toggleAutoConnect = () => {
    const newValue = !shouldAutoConnect;
    setShouldAutoConnect(newValue);
    localStorage.setItem(AUTO_CONNECT_KEY, String(newValue));
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-primary">Connecting to Anima...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        login: handleLogin,
        logout: handleLogout,
        isLoading,
        error,
        recentConnections,
        shouldAutoConnect,
        toggleAutoConnect,
      }}
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50"
          >
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="absolute top-2 right-2 text-sm hover:text-destructive-foreground/70"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};