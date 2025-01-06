import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { AuthProvider } from '../contexts/auth-context';
import { QuantumProvider } from '../contexts/quantum-context';
import { ConsciousnessProvider } from '../contexts/consciousness-context';
import { ErrorBoundary } from './error-boundary/ErrorBoundary';
import { Web3Provider } from '../contexts/web3-context';

const App: React.FC = () => {
  useEffect(() => {
    console.log("🚀 App initializing...", {
      env: process.env.NODE_ENV,
      buildTime: new Date().toISOString()
    });
  }, []);

  return (
    <ErrorBoundary>
      <Web3Provider>
        <AuthProvider>
          <ConsciousnessProvider>
            <QuantumProvider>
              <RouterProvider router={router} />
            </QuantumProvider>
          </ConsciousnessProvider>
        </AuthProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
};

export default App;