import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { ErrorBoundary } from './error-boundary/ErrorBoundary';
import { AuthProvider } from '@/contexts/auth-context';
import { LoadingFallback } from './ui/LoadingFallback';
import RootLayout from './layout/RootLayout';

// ErrorFallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="max-w-md text-center p-8">
      <h1 className="text-xl font-bold mb-4">System Error</h1>
      <p className="text-red-400 mb-6">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Retry
      </button>
    </div>
  </div>
);

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure all critical dependencies are loaded
    Promise.all([
      import('framer-motion'),
      import('react-router-dom')
    ]).then(() => {
      setIsReady(true);
    }).catch(error => {
      console.error('Failed to load dependencies:', error);
    });
  }, []);

  if (!isReady) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <LazyMotion features={domAnimation} strict={false}>
          <m.div
            initial={false}
            className="min-h-screen bg-black text-white overflow-hidden"
          >
            <AuthProvider>
              <Suspense fallback={<LoadingFallback />}>
                <RootLayout />
              </Suspense>
            </AuthProvider>
          </m.div>
        </LazyMotion>
      </Router>
    </ErrorBoundary>
  );
};

export default App;