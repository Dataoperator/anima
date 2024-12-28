import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '@/components/layout/LandingPage';
import MintAnima from '@/components/anima/MintAnima';
import ImmersiveAnimaUI from '@/components/ImmersiveAnimaUI';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InitializationCheck } from '@/components/auth/InitializationCheck';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/init',
    element: (
      <ProtectedLayout>
        <InitializationCheck />
      </ProtectedLayout>
    ),
  },
  {
    path: '/mint',
    element: (
      <ProtectedLayout>
        <MintAnima />
      </ProtectedLayout>
    ),
  },
  {
    path: '/anima/:id',
    element: (
      <ProtectedLayout>
        <ImmersiveAnimaUI />
      </ProtectedLayout>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);