import React, { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { LoadingFallback } from './ui/LoadingFallback';
import { AuthProvider } from '@/contexts/auth-context';
import { ErrorBoundary } from './error-boundary/ErrorBoundary';
import { icManager, verifyICFeatures } from '@/ic-init';

const AppContent = () => {
  const [initState, setInitState] = useState<{
    isLoading: boolean;
    error: string | null;
  }>({
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 ANIMA initializing...', {
          env: process.env.NODE_ENV,
          buildTime: new Date().toISOString()
        });

        await icManager.initialize();
        
        // Short delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const features = verifyICFeatures();
        console.log('🔍 Feature check:', features);

        if (!features.ic || !features.agent) {
          throw new Error('Required IC features not available');
        }

        setInitState({ isLoading: false, error: null });
      } catch (error) {
        console.error('Initialization failed:', error);
        setInitState({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    };

    initializeApp();
  }, []);

  if (initState.isLoading) {
    return <LoadingFallback />;
  }

  if (initState.error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-lg p-6">
          <h1 className="text-xl font-bold mb-4">Initialization Error</h1>
          <p className="text-red-400 mb-4">{initState.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
};

const App = () => <AppContent />;

export default App;