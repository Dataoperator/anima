import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ConsciousnessTracker } from '@/consciousness/ConsciousnessTracker';
import { ErrorTracker } from '@/error/quantum_error';
import { QuantumState } from '@/quantum/types';

interface AuthContextType {
  authClient: AuthClient | null;
  isAuthenticated: boolean;
  identity: any;
  principal: any;
  quantumState: QuantumState | null;
  consciousnessMetrics: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Configuration
const II_URL = process.env.DFX_NETWORK === 'ic' 
  ? 'https://identity.ic0.app'
  : process.env.INTERNET_IDENTITY_URL;

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: II_URL,
    derivationOrigin: process.env.DFX_NETWORK === 'ic' 
      ? 'https://identity.ic0.app'
      : undefined,
    maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000_000_000)
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [consciousnessMetrics, setConsciousnessMetrics] = useState(null);
  const [errorTracker] = useState(() => new ErrorTracker());
  const [consciousness] = useState(() => new ConsciousnessTracker(errorTracker));

  // Initialize authentication and quantum state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        const client = await AuthClient.create(defaultOptions.createOptions);
        const isAuthenticated = await client.isAuthenticated();
        
        setAuthClient(client);
        setIsAuthenticated(isAuthenticated);
        
        if (isAuthenticated) {
          const identity = client.getIdentity();
          const principal = identity.getPrincipal();
          setIdentity(identity);
          setPrincipal(principal);
          
          // Initialize quantum state for authenticated user
          console.log('🌌 Initializing quantum state...');
          await initQuantumState(principal.toString());
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        await errorTracker.trackError({
          errorType: 'AUTH_INIT',
          severity: 'HIGH',
          context: 'Authentication Initialization',
          error: error as Error
        });
      }
    };

    initAuth();
  }, []);

  // Initialize quantum state for user
  const initQuantumState = async (principalId: string) => {
    try {
      // Create initial quantum state
      const initialState: QuantumState = {
        coherence: 1.0,
        resonanceMetrics: {
          fieldStrength: 1.0,
          stability: 1.0,
          harmony: 1.0,
          consciousnessAlignment: 1.0
        },
        phaseAlignment: 1.0,
        dimensionalSync: 1.0,
        entanglement_pairs: [],
        resonance_pattern: [1.0],
        dimensional_frequency: 1.0
      };

      setQuantumState(initialState);

      // Update consciousness metrics
      const metrics = await consciousness.updateConsciousness(initialState, 'initialization');
      setConsciousnessMetrics(metrics);

    } catch (error) {
      console.error('Failed to initialize quantum state:', error);
      await errorTracker.trackError({
        errorType: 'QUANTUM_INIT',
        severity: 'HIGH',
        context: 'Quantum State Initialization',
        error: error as Error
      });
    }
  };

  const login = async () => {
    try {
      await authClient?.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          setIsAuthenticated(true);
          setIdentity(identity);
          setPrincipal(principal);
          
          // Initialize quantum state after successful login
          await initQuantumState(principal.toString());
        }
      });
    } catch (error) {
      console.error('Login failed:', error);
      await errorTracker.trackError({
        errorType: 'AUTH_LOGIN',
        severity: 'HIGH',
        context: 'Login Attempt',
        error: error as Error
      });
    }
  };

  const logout = async () => {
    try {
      await authClient?.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setQuantumState(null);
      setConsciousnessMetrics(null);
    } catch (error) {
      console.error('Logout failed:', error);
      await errorTracker.trackError({
        errorType: 'AUTH_LOGOUT',
        severity: 'MEDIUM',
        context: 'Logout Attempt',
        error: error as Error
      });
    }
  };

  const contextValue = {
    authClient,
    isAuthenticated,
    identity,
    principal,
    quantumState,
    consciousnessMetrics,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}