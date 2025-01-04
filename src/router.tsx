import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { QuantumLoadingState } from './components/ui/LoadingStates';

// Lazy loaded components
const LandingPage = lazy(() => import('./components/pages/LandingPage'));
const CyberpunkQuantumVault = lazy(() => import('./components/quantum-vault/CyberpunkQuantumVault'));
const GenesisPage = lazy(() => import('./components/pages/GenesisPage'));
const AnimaPage = lazy(() => import('./components/pages/AnimaPage'));
const EnhancedNeuralLinkPage = lazy(() => import('./components/pages/EnhancedNeuralLinkPage'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<QuantumLoadingState />}>
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
    path: '/vault',
    element: withSuspense(CyberpunkQuantumVault),
  },
  {
    path: '/genesis',
    element: withSuspense(GenesisPage),
  },
  {
    path: '/anima/:id',
    element: withSuspense(AnimaPage),
  },
  {
    path: '/neural-link/:id?',
    element: withSuspense(EnhancedNeuralLinkPage),
  },
  // Redirect old routes to new vault
  {
    path: '/quantum-vault',
    element: withSuspense(CyberpunkQuantumVault),
  },
  {
    path: '/nexus',
    element: withSuspense(CyberpunkQuantumVault),
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});