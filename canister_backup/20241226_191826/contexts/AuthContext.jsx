import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthClient } from '@/utils/auth/authClient';
import { logError } from '@/utils/errorReporting';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnostics, setDiagnostics] = useState(null);
  const initialized = useRef(false);

  const updateState = useCallback(async (authClient) => {
    const isAuthed = authClient.isAuthenticated();
    const currentIdentity = authClient.getIdentity();
    const currentPrincipal = currentIdentity?.getPrincipal();
    const currentActor = authClient.getActor();
    const currentDiagnostics = authClient.getDiagnostics();

    setIsAuthenticated(isAuthed);
    setIdentity(currentIdentity);
    setPrincipal(currentPrincipal);
    setActor(currentActor);
    setDiagnostics(currentDiagnostics);

    return {
      isAuthed,
      currentIdentity,
      currentPrincipal,
      currentActor,
      currentDiagnostics
    };
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const authClient = await getAuthClient();
      await updateState(authClient);
    } catch (err) {
      const enrichedError = {
        ...err,
        context: 'checkAuth',
        diagnostics: await getAuthClient().then(client => client.getDiagnostics())
      };
      logError(enrichedError);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [updateState]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      checkAuth();
    }

    // Setup periodic auth check
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  const login = async () => {
    try {
      const authClient = await getAuthClient();
      const identity = await authClient.login();
      await updateState(authClient);
      return identity;
    } catch (err) {
      const enrichedError = {
        ...err,
        context: 'login',
        diagnostics: await getAuthClient().then(client => client.getDiagnostics())
      };
      logError(enrichedError);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const authClient = await getAuthClient();
      await authClient.logout();
      await updateState(authClient);
    } catch (err) {
      const enrichedError = {
        ...err,
        context: 'logout',
        diagnostics: await getAuthClient().then(client => client.getDiagnostics())
      };
      logError(enrichedError);
      setError(err.message);
      throw err;
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    isAuthenticated,
    identity,
    principal,
    login,
    logout,
    actor,
    error,
    setError,
    clearError,
    loading,
    checkAuth,
    diagnostics
  };

  return (
    <AuthContext.Provider value={value}>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md"
          >
            <div className="mr-8">
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
              {diagnostics?.lastError && (
                <p className="text-xs mt-1 opacity-80">
                  Details: {diagnostics.lastError.phase} - {diagnostics.lastError.error}
                </p>
              )}
            </div>
            <button
              onClick={clearError}
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}