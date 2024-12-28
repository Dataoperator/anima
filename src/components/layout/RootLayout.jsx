import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { ErrorBoundary } from './ErrorBoundary';

export const RootLayout = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PaymentProvider>
          <Outlet />
        </PaymentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};