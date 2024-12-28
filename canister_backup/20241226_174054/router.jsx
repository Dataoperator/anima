import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/layout/LandingPage';
import MintAnima from '@/components/anima/MintAnima';
import ImmersiveAnimaUI from '@/components/ImmersiveAnimaUI';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InitializationCheck } from '@/components/auth/InitializationCheck';

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/check" replace /> : <LandingPage />;
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
    path: '/check',
    element: <InitializationCheck />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
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
]);