import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { Loading } from './components/Loading';
import { InitializationFlow } from './InitializationFlow';
import EnhancedChat from './components/EnhancedChat';
import ErrorBoundary from './components/ErrorBoundary';

const AppContent = () => {
  const { authState, error, isLoading } = useAuth();

  useEffect(() => {
    const setupViewHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setupViewHeight();
    window.addEventListener('resize', setupViewHeight);

    return () => window.removeEventListener('resize', setupViewHeight);
  }, []);

  if (isLoading) {
    return <Loading message="Initializing Anima..." />;
  }

  return (
    <AnimatePresence mode="wait">
      {!authState.isAuthenticated ? (
        <InitializationFlow />
      ) : (
        <EnhancedChat />
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;