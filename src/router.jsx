import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useParams } from 'react-router-dom';
import QuantumVault from './components/quantum-vault/QuantumVault';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { AdminRoute } from './components/auth/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/Dashboard';
import { AdminManagement } from './components/admin/AdminManagement';
import { AdminMetrics } from './components/admin/AdminMetrics';
import LandingPage from './components/layout/LandingPage';
import { AuthGuard } from './components/auth/AuthGuard';
import { EnhancedImmersiveAnimaUI } from './components/chat/EnhancedImmersiveAnimaUI';
import { useAnima } from './hooks/useAnima';
import { AnimaPage } from './components/pages/AnimaPage';
import { Genesis } from './components/genesis';
import { EnhancedPaymentPanel } from './components/payment/EnhancedPaymentPanel';

const NeuralLinkView = () => {
  const { id } = useParams();
  const { anima, loading, error } = useAnima(id);
  
  if (loading) {
    return <div>Initializing Neural Link...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return <EnhancedImmersiveAnimaUI anima={anima} />;
};

// Rename our exported component to AppRoutes
export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <RouterRoutes>
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
                <RouterRoutes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="metrics" element={<AdminMetrics />} />
                  <Route path="users" element={<AdminManagement />} />
                  <Route path="quantum" element={<div>Quantum Control Panel</div>} />
                  <Route path="system" element={<div>System Management</div>} />
                  <Route path="alerts" element={<div>Alert Center</div>} />
                  <Route path="settings" element={<div>Admin Settings</div>} />
                </RouterRoutes>
              </AdminLayout>
            </AdminRoute>
          } />

          {/* Redirect /mint to /genesis */}
          <Route path="/mint" element={<Navigate to="/genesis" replace />} />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

// For backward compatibility
export const Router = AppRoutes;
export default AppRoutes;