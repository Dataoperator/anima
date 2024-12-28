import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/layout/LandingPage';
import MintAnima from '@/components/anima/MintAnima';
import ImmersiveAnimaUI from '@/components/ImmersiveAnimaUI';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InitializationCheck } from '@/components/auth/InitializationCheck';

const AuthCheck = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  
  return isAuthenticated ? <Navigate to="/init" replace /> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthCheck />,
  },
  {
    path: '/login',
    element: <LandingPage />,
  },
  {
    path: '/init',
    element: <ProtectedLayout><InitializationCheck /></ProtectedLayout>,
  },
  {
    path: '/mint',
    element: <ProtectedLayout><MintAnima /></ProtectedLayout>,
  },
  {
    path: '/anima/:id',
    element: <ProtectedLayout><ImmersiveAnimaUI /></ProtectedLayout>,
  }
]);