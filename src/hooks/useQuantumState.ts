import { useState, useEffect } from 'react';

interface QuantumState {
  stabilityStatus: 'stable' | 'unstable' | 'critical';
  coherenceLevel: number;
  entanglementIndex: number;
  quantumSignature: string;
}

export const useQuantumState = () => {
  const [state, setState] = useState<QuantumState>({
    stabilityStatus: 'unstable',
    coherenceLevel: 0,
    entanglementIndex: 0,
    quantumSignature: ''
  });

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const updateQuantumState = () => {
      if (!mounted) return;

      const coherenceLevel = Math.random();
      const entanglementIndex = Math.random();
      
      setState({
        stabilityStatus: coherenceLevel > 0.7 ? 'stable' : coherenceLevel > 0.3 ? 'unstable' : 'critical',
        coherenceLevel,
        entanglementIndex,
        quantumSignature: Math.random().toString(36).substring(2)
      });
    };

    updateQuantumState();
    intervalId = setInterval(updateQuantumState, 3000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return state;
};