import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { AdminRoute } from './components/auth/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { useAnima } from './hooks/useAnima';

// Lazy load components for better performance
const QuantumVault = React.lazy(() => import('./components/quantum-vault/QuantumVault'));
const AdminDashboard = React.lazy(() => import('./components/admin/Dashboard'));
const AdminManagement = React.lazy(() => import('./components/admin/AdminManagement'));
const AdminMetrics = React.lazy(() => import('./components/admin/AdminMetrics'));
const LandingPage = React.lazy(() => import('./components/layout/LandingPage'));
const EnhancedImmersiveAnimaUI = React.lazy(() => import('./components/chat/EnhancedImmersiveAnimaUI'));
const AnimaPage = React.lazy(() => import('./components/pages/AnimaPage'));
const Genesis = React.lazy(() => import('./components/genesis'));
const EnhancedPaymentPanel = React.lazy(() => import('./components/payment/EnhancedPaymentPanel'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-black text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p className="mt-4">Initializing Quantum State...</p>
    </div>
  </div>
);

const NeuralLinkView = () => {
  const { id } = useParams();
  const { anima, loading, error } = useAnima(id);
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Neural Link Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return <EnhancedImmersiveAnimaUI anima={anima} />;
};

export const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            {/* Quantum Vault */}
            <Route path="/quantum-vault" element={<QuantumVault />} />
            
            {/* Genesis - handles minting and initialization */}
            <Route path="/genesis" element={<Genesis />} />
            
            {/* Enhanced payment flow */}
            <Route path="/payment/*" element={<EnhancedPaymentPanel />} />

            {/* ANIMA Neural Link Interface */}
            <Route path="/neural-link/:id" element={<NeuralLinkView />} />
            
            {/* Individual ANIMA view */}
            <Route path="/anima/:id" element={<AnimaPage />} />
          </Route>

          {/* Admin Routes - All wrapped in AdminLayout */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="metrics" element={<AdminMetrics />} />
                  <Route path="users" element={<AdminManagement />} />
                  <Route path="quantum" element={<div>Quantum Control Panel</div>} />
                  <Route path="system" element={<div>System Management</div>} />
                  <Route path="alerts" element={<div>Alert Center</div>} />
                  <Route path="settings" element={<div>Admin Settings</div>} />
                </Routes>
              </AdminLayout>
            </AdminRoute>
          } />

          {/* Redirect /mint to /genesis */}
          <Route path="/mint" element={<Navigate to="/genesis" replace />} />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

// For backward compatibility
export const Router = AppRoutes;
export default AppRoutes;