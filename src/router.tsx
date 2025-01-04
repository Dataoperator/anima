import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingFallback } from './components/ui/LoadingFallback';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';

// Lazy load components
const LandingPage = lazy(() => import('./components/pages/LandingPage'));
const QuantumVault = lazy(() => import('./components/quantum-vault/QuantumVault'));
const GenesisPage = lazy(() => import('./components/pages/GenesisPage'));
const AnimaPage = lazy(() => import('./components/pages/AnimaPage'));
const EnhancedNeuralLinkPage = lazy(() => import('./components/pages/EnhancedNeuralLinkPage'));

const withSuspense = (Component: React.ComponentType<any>) => (
  <Suspense fallback={<LoadingFallback />}>
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(LandingPage),
  },
  {
    path: '/quantum-vault',
    element: withSuspense(QuantumVault),
  },
  {
    path: '/genesis',
    element: withSuspense(GenesisPage),
  },
  {
    path: '/anima',
    element: withSuspense(AnimaPage),
  },
  {
    path: '/neural-link/:id?',
    element: withSuspense(EnhancedNeuralLinkPage),
  },
  {
    path: '*',
    element: withSuspense(LandingPage),
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});