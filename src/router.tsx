import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { LoadingFallback } from './components/ui/LoadingFallback';
import { AuthGuard } from './components/auth';
import { RootLayout } from './components/layout/RootLayout';

// Lazy loaded components
const LandingPage = lazy(() => import('./components/pages/LandingPage'));
const QuantumVault = lazy(() => import('./components/quantum-vault/CyberpunkQuantumVault'));
const GenesisPage = lazy(() => import('./components/pages/GenesisPage'));
const AnimaPage = lazy(() => import('./components/pages/AnimaPage'));
const Wallet = lazy(() => import('./components/ui/Wallet'));
const NeuralLinkPage = lazy(() => import('./components/pages/NeuralLinkPage'));
const GenesisRitual = lazy(() => import('./components/genesis/GenesisRitual'));

// Neural Link Components
const IntegratedNeuralLinkInterface = lazy(
  () => import('./components/neural-link/IntegratedNeuralLinkInterface')
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingFallback />}>
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: withSuspense(LandingPage),
      },
      {
        element: <AuthGuard />,
        children: [
          {
            path: 'quantum-vault',
            element: withSuspense(QuantumVault),
            children: [
              {
                path: 'create',
                element: <Navigate to="/genesis" replace />,
              }
            ]
          },
          {
            path: 'genesis',
            element: withSuspense(GenesisPage),
            children: [
              {
                path: 'ritual/:sessionId',
                element: withSuspense(GenesisRitual),
              }
            ]
          },
          {
            path: 'anima/:id',
            children: [
              {
                index: true,
                element: withSuspense(AnimaPage),
              },
              {
                path: 'neural-link',
                element: withSuspense(NeuralLinkPage),
                children: [
                  {
                    path: ':tab',
                    element: withSuspense(IntegratedNeuralLinkInterface),
                  }
                ]
              }
            ]
          },
          {
            path: 'wallet',
            element: withSuspense(Wallet),
          },
        ],
      },
    ],
  },
]);