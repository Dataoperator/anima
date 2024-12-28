import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { router } from './router';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Loading } from '@/components/layout/Loading';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;