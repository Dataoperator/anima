import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingFallback } from './components/ui/LoadingFallback';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';

// Lazy load components
const LandingPage = lazy(() => import('./components/pages/LandingPage'));
const AnimaPage = lazy(() => import('./components/pages/AnimaPage'));
const GenesisPage = lazy(() => import('./components/pages/GenesisPage'));
const NeuralLinkPage = lazy(() => import('./components/pages/NeuralLinkPage'));
const AdminManagement = lazy(() => import('./components/admin/AdminManagement'));

const withSuspense = (Component: React.ComponentType<any>) => (
  <Suspense fallback={<LoadingFallback />}>
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  </Suspense>
);

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: withSuspense(LandingPage),
    },
    {
      path: '/anima',
      element: withSuspense(AnimaPage),
    },
    {
      path: '/genesis',
      element: withSuspense(GenesisPage),
    },
    {
      path: '/neural-link',
      element: withSuspense(NeuralLinkPage),
    },
    {
      path: '/admin',
      element: withSuspense(AdminManagement),
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);