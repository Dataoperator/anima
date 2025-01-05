import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { AuthProvider } from '@/contexts/auth-context';
import { AnimaProvider } from '@/contexts/anima-context';
import { ErrorBoundary } from './error-boundary/ErrorBoundary';

const App = () => {
  console.log('🚀 App initializing...', {
    env: process.env.NODE_ENV,
    buildTime: new Date().toISOString()
  });

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AnimaProvider>
          <RouterProvider router={router} />
        </AnimaProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;