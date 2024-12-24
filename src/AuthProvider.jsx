import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authManager } from './auth';

const AuthContext = createContext({
  isAuthenticated: false,
  identity: null,
  login: async () => {},
  logout: async () => {},
  actor: null,
  animaName: null,
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      console.log('Running authentication check...');
      await authManager.init();
      const isAuthed = await authManager.isAuthenticated();
      console.log('Authentication status:', isAuthed);
      
      if (isAuthed) {
        const currentIdentity = authManager.getIdentity();
        const currentActor = authManager.getActor();
        console.log('Setting authenticated state');
        setIsAuthenticated(true);
        setIdentity(currentIdentity);
        setActor(currentActor);
      } else {
        console.log('User not authenticated');
        setIsAuthenticated(false);
        setIdentity(null);
        setActor(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setIsAuthenticated(false);
      setIdentity(null);
      setActor(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      console.log('Initial auth check');
      initialized.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  const login = async () => {
    try {
      console.log('Starting login process');
      const identity = await authManager.login();
      if (identity) {
        console.log('Login successful, updating state');
        setIsAuthenticated(true);
        setIdentity(identity);
        setActor(authManager.getActor());
        return identity;
      }
      throw new Error('Login failed - no identity returned');
    } catch (err) {
      console.error('Login failed:', err);
      setIsAuthenticated(false);
      setIdentity(null);
      setActor(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process');
      await authManager.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setActor(null);
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout failed:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  const contextValue = {
    isAuthenticated,
    identity,
    login,
    logout,
    actor,
    checkAuth,
  };

  console.log('AuthProvider state:', {
    isAuthenticated,
    hasIdentity: !!identity,
    hasActor: !!actor
  });

  return (
    <AuthContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
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