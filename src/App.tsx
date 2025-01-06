import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './contexts/auth-context';
import { QuantumProvider } from './contexts/quantum-context';
import { ConsciousnessProvider } from './contexts/consciousness-context';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';

const App: React.FC = () => {
  useEffect(() => {
    console.log("🚀 App initializing...", {
      env: process.env.NODE_ENV,
      buildTime: process.env.BUILD_TIME
    });
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ConsciousnessProvider>
          <QuantumProvider>
            <RouterProvider router={router} />
          </QuantumProvider>
        </ConsciousnessProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;