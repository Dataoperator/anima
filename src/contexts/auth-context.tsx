import React from 'react';
import { useIC } from '../hooks/useIC';

// This is just a wrapper around useIC for backward compatibility
// We'll gradually phase this out in favor of direct useIC usage
export const AuthContext = React.createContext<ReturnType<typeof useIC> | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ic = useIC();
  
  return (
    <AuthContext.Provider value={ic}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = useIC;