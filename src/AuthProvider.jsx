import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authManager } from './auth';

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
    />
  </div>
);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isInitialized: false,
    principalId: null,
    animaName: null,
    creationTime: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Initializing auth...");
        await authManager.initialize();
        const state = authManager.getState();
        console.log("Auth state:", state);
        
        if (state.isAuthenticated && state.principal) {
          const isInitialized = await authManager.checkInitialization();
          setAuthState({ 
            isAuthenticated: true, 
            isInitialized, 
            principalId: state.principal.toString(),
            animaName: null,
            creationTime: null,
          });
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    setIsLoading(true);
    try {
      await authManager.login();
      const state = authManager.getState();
      
      if (state.principal) {
        const isInitialized = await authManager.checkInitialization();
        setAuthState({ 
          isAuthenticated: true, 
          isInitialized,
          principalId: state.principal.toString(),
          animaName: null,
          creationTime: null,
        });
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const initialize = async (name, apiKey) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await authManager.createAnima(name, apiKey);
      setAuthState(prev => ({ 
        ...prev, 
        isInitialized: true,
        principalId: result.anima_id.toString(),
        animaName: result.name,
        creationTime: result.creation_time
      }));
      return result;
    } catch (err) {
      console.error('Initialization failed:', err);
      setError('Failed to create Anima');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authManager.logout();
    setAuthState({
      isAuthenticated: false,
      isInitialized: false,
      principalId: null,
      animaName: null,
      creationTime: null,
    });
  };

  const contextValue = {
    ...authState,
    login,
    logout,
    initialize,
    error,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-3 hover:text-red-200"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

export default AuthProvider;