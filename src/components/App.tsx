import React, { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { LoadingFallback } from './ui/LoadingFallback';
import { AuthProvider } from '@/contexts/auth-context';
import { ErrorBoundary } from './error-boundary/ErrorBoundary';

const AppContent = () => {
  useEffect(() => {
    console.log('🚀 ANIMA initializing...', {
      env: process.env.NODE_ENV,
      buildTime: new Date().toISOString()
    });
    
    // Log available features
    console.log('🔍 Feature check:', {
      canister: !!window.canister,
      ic: !!window.ic,
      ic_plug: !!(window.ic?.plug),
      principal: !!(window.ic?.Principal),
    });
  }, []);

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