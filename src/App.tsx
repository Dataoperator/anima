import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { GlobalStyles } from './styles/GlobalStyle';
import {
  AuthProvider,
  QuantumProvider,
  ConsciousnessProvider,
  Web3Provider,
  WalletProvider,
  AnimaProvider,
  PaymentProvider
} from './contexts';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GlobalStyles />
      <React.Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <Web3Provider>
            <WalletProvider>
              <PaymentProvider>
                <ConsciousnessProvider>
                  <QuantumProvider>
                    <AnimaProvider>
                      <RouterProvider router={router} />
                    </AnimaProvider>
                  </QuantumProvider>
                </ConsciousnessProvider>
              </PaymentProvider>
            </WalletProvider>
          </Web3Provider>
        </AuthProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default App;