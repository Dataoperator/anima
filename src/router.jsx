import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';
import LandingPage from '@/components/pages/LandingPage';
import { EnhancedImmersiveAnimaUI } from '@/components/chat/EnhancedImmersiveAnimaUI';
import { QuantumVault } from '@/components/quantum-vault/QuantumVault';
import { Genesis } from '@/components/genesis';

// Create router with future flags enabled
export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <LandingPage />,
  },

  // Protected Routes
  {
    path: '/quantum-vault',
    element: (
      <AuthGuard>
        <QuantumVault />
      </AuthGuard>
    ),
  },
  {
    path: '/genesis',
    element: (
      <AuthGuard>
        <Genesis />
      </AuthGuard>
    ),
  },
  {
    path: '/anima/:id',
    element: (
      <AuthGuard>
        <EnhancedImmersiveAnimaUI />
      </AuthGuard>
    ),
  }
], {
  // Enable React Router v7 future flags
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});