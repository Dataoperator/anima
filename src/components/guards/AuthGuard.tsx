import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIC } from '../../hooks/useIC';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isInitialized } = useIC();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500">
          <div className="h-full w-full rounded-full border-t-2 border-blue-500/30"></div>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;