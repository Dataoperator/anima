import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { LoadingFallback } from './components/ui/LoadingFallback';
import { AuthGuard } from './components/auth/AuthGuard';

// Lazy loaded components
const LandingPage = lazy(() => import('./components/pages/LandingPage'));
const CyberpunkQuantumVault = lazy(() => import('./components/quantum-vault/CyberpunkQuantumVault'));
const GenesisPage = lazy(() => import('./components/pages/GenesisPage'));
const AnimaPage = lazy(() => import('./components/pages/AnimaPage'));
const EnhancedNeuralLinkPage = lazy(() => import('./components/pages/EnhancedNeuralLinkPage'));
const Wallet = lazy(() => import('./components/ui/Wallet'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingFallback />}>
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  </Suspense>
);

export const router = createBrowserRouter([
  // Landing page - public
  {
    path: '/',
    element: withSuspense(LandingPage),
  },
  
  // Protected routes
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/quantum-vault',
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
      {
        path: '/wallet',
        element: withSuspense(Wallet),
      },
    ],
  },
]);