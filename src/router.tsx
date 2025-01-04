import { createBrowserRouter, RouterProvider as ReactRouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { QuantumLoadingState } from './components/ui/LoadingStates';
import { AuthGuard } from './components/auth/AuthGuard';

// Lazy loaded components
const LandingPage = lazy(() => import('./components/pages/LandingPage'));
const CyberpunkQuantumVault = lazy(() => import('./components/quantum-vault/CyberpunkQuantumVault'));
const GenesisPage = lazy(() => import('./components/pages/GenesisPage'));
const AnimaPage = lazy(() => import('./components/pages/AnimaPage'));
const EnhancedNeuralLinkPage = lazy(() => import('./components/pages/EnhancedNeuralLinkPage'));
const Wallet = lazy(() => import('./components/ui/Wallet'));

const withSuspense = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<QuantumLoadingState />}>
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  </Suspense>
);

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: withSuspense(LandingPage)({}),
  },
  
  // Protected Routes - All require authentication
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/vault',
        element: withSuspense(CyberpunkQuantumVault)({}),
      },
      {
        path: '/genesis',
        element: withSuspense(GenesisPage)({}),
      },
      {
        path: '/anima/:id',
        element: withSuspense(AnimaPage)({}),
      },
      {
        path: '/neural-link/:id?',
        element: withSuspense(EnhancedNeuralLinkPage)({}),
      },
      {
        path: '/wallet',
        element: withSuspense(Wallet)({}),
      },
      {
        path: '/quantum-vault',
        element: withSuspense(CyberpunkQuantumVault)({}),
      },
    ],
  },

  // Catch all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

// Root component that provides router context
export const AppRouter: React.FC = () => (
  <ErrorBoundary>
    <ReactRouterProvider router={router} />
  </ErrorBoundary>
);
