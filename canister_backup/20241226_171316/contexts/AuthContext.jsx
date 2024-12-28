import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthManager } from '@/utils/auth';
import { Actor } from '@dfinity/agent';
import { CANISTER_IDS } from '@/config';
import { AuthenticationError, logError } from '@/utils/errorReporting';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialized = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      const authManager = await getAuthManager();
      
      if (await authManager.isAuthenticated()) {
        const currentIdentity = authManager.getIdentity();
        const currentPrincipal = currentIdentity.getPrincipal();
        const currentActor = authManager.getActor();
        
        setIsAuthenticated(true);
        setIdentity(currentIdentity);
        setPrincipal(currentPrincipal);
        
        if (currentActor) {
          setActor(currentActor);
        }
      } else {
        setIsAuthenticated(false);
        setIdentity(null);
        setPrincipal(null);
        setActor(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logError(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  const login = async () => {
    try {
      const authManager = await getAuthManager();
      const identity = await authManager.login();
      const principal = identity.getPrincipal();
      
      setIsAuthenticated(true);
      setIdentity(identity);
      setPrincipal(principal);
      
      const actor = authManager.getActor();
      if (actor) {
        setActor(actor);
      }
    } catch (err) {
      console.error('Login failed:', err);
      logError(err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const authManager = await getAuthManager();
      await authManager.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setActor(null);
    } catch (err) {
      console.error('Logout failed:', err);
      logError(err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    isAuthenticated,
    identity,
    principal,
    login,
    logout,
    actor,
    error,
    setError,
    loading,
    checkAuth
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}