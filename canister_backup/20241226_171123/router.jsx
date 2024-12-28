import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/layout/LandingPage';
import MintAnima from '@/components/anima/MintAnima';
import ImmersiveAnimaUI from '@/components/ImmersiveAnimaUI';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InitializationCheck } from '@/components/auth/InitializationCheck';

// Component to handle root route redirection
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <Navigate to="/dashboard" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: <LandingPage />,
  },
  {
    path: '/',  // Parent route for all authenticated routes
    element: <ProtectedLayout />,
    children: [
      {
        path: 'dashboard',
        element: <InitializationCheck />,
        children: [
          {
            path: '',
            element: <Navigate to="/mint" replace />
          },
          {
            path: 'mint',
            element: <MintAnima />
          },
          {
            path: 'anima/:id',
            element: <ImmersiveAnimaUI />
          }
        ]
      }
    ]
  }
]);
