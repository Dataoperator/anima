import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { AuthRedirect } from '@/components/auth/AuthRedirect';
import { LandingPage } from '@/components/pages/LandingPage';
import { AnimaPage } from '@/components/pages/AnimaPage';
import { RootLayout } from '@/components/layout/RootLayout';
import { QuantumVault } from '@/components/quantum-vault/QuantumVault';

// Admin route is nested deep to be discrete
const AdminMetrics = React.lazy(() => import('@/components/admin/AdminMetrics'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/dashboard',
        element: <AuthRedirect />,
      },
      {
        path: '/quantum-vault',
        element: <QuantumVault />,
      },
      {
        path: '/anima/:id',
        element: <AnimaPage />,
      },
      // Discrete admin route
      {
        path: '/system/metrics/overview',
        element: (
          <AdminRoute>
            <AdminMetrics />
          </AdminRoute>
        ),
      },
    ],
  },
]);