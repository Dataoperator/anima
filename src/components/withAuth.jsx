import React from 'react';
import { useAuth } from '../AuthProvider';

export const withAuth = (WrappedComponent) => {
  return function WithAuthComponent(props) {
    const auth = useAuth();

    if (!auth || auth.isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} auth={auth} />;
  };
};

export default withAuth;