import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { RootLayout } from '@/components/layout/RootLayout';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

// Lazy-loaded components
const LandingPage = React.lazy(() => import('@/components/layout/LandingPage'));
const QuantumVault = React.lazy(() => import('@/components/quantum-vault/QuantumVaultGrid'));
const GenesisFlow = React.lazy(() => import('@/components/genesis/GenesisFlow'));
const AnimaPage = React.lazy(() => import('@/components/pages/AnimaPage'));
const NeuralLinkPage = React.lazy(() => import('@/components/neural-link/NeuralLinkPage'));
const AdminDashboard = React.lazy(() => import('@/components/admin/AdminDashboard'));

const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: 'quantum-vault',
            element: <AuthGuard><QuantumVault /></AuthGuard>
          },
          {
            path: 'genesis',
            element: <AuthGuard><GenesisFlow /></AuthGuard>
          },
          {
            path: 'anima/:id',
            element: <AuthGuard><AnimaPage /></AuthGuard>
          },
          {
            path: 'anima/:id/neural-link',
            element: <AuthGuard><NeuralLinkPage /></AuthGuard>
          },
          {
            path: 'admin/*',
            element: (
              <AuthGuard>
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              </AuthGuard>
            )
          }
        ]
      }
    ]
  }
];

export const router = createBrowserRouter(routes);

const Router: React.FC = () => {
  return (
    <React.Suspense 
      fallback={
        <div className="min-h-screen bg-black text-cyan-500 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="quantum-loader">Initializing ANIMA Systems...</div>
          </div>
        </div>
      }
    >
      <RouterProvider router={router} />
    </React.Suspense>
  );
};

export default Router;