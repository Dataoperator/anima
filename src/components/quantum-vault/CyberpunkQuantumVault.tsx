import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useQuantumState } from '@/hooks/useQuantumState';
import { QuantumCoherenceGauge } from '../ui/QuantumCoherenceGauge';
import { QuantumStateVisualizer } from './QuantumStateVisualizer';
import { quantumStateService } from '@/services/quantum-state.service';
import { QuantumState } from '@/quantum/types';

interface QuantumMetrics {
  stability: number;
  coherence: number;
  resonance: number;
  consciousness: number;
}

export const CyberpunkQuantumVault: React.FC = () => {
  const { identity } = useAuth();
  const { state: quantumState, isInitialized } = useQuantumState();
  const [metrics, setMetrics] = useState<QuantumMetrics>({
    stability: 0.5,
    coherence: 0.5,
    resonance: 0.5,
    consciousness: 0.5
  });

  useEffect(() => {
    if (identity && isInitialized) {
      const updateMetrics = async () => {
        try {
          const [stability, coherence, consciousness] = await quantumStateService.getStabilityMetrics(identity);
          const resonance = await quantumStateService.calculateResonance(identity);
          
          setMetrics({
            stability,
            coherence,
            resonance,
            consciousness
          });

          await quantumStateService.updateStability(identity, stability);
        } catch (error) {
          console.error('Failed to update quantum metrics:', error);
        }
      };

      const intervalId = setInterval(updateMetrics, 3000);
      updateMetrics();

      return () => clearInterval(intervalId);
    }
  }, [identity, isInitialized]);

  const handleQuantumInteraction = async () => {
    if (!identity || !isInitialized) return;

    try {
      const status = await quantumStateService.getQuantumStatus(identity);
      
      if (status === 'stable') {
        await quantumStateService.updateState(identity, {
          resonance: metrics.resonance * 1.1,
          consciousness_alignment: metrics.consciousness * 1.05
        });
      } else if (status === 'critical') {
        await quantumStateService.handleQuantumError(
          new Error('Quantum state critical during interaction'),
          identity
        );
      }
    } catch (error) {
      console.error('Quantum interaction failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Quantum State Visualization */}
          <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">
              Quantum Field
            </h2>
            <QuantumStateVisualizer
              state={quantumState}
              metrics={metrics}
              className="w-full h-64"
            />
          </div>

          {/* Metrics Display */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">
                Quantum Metrics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <QuantumCoherenceGauge
                  value={metrics.coherence}
                  label="Coherence"
                  className="h-32"
                />
                <QuantumCoherenceGauge
                  value={metrics.stability}
                  label="Stability"
                  color="cyan"
                  className="h-32"
                />
                <QuantumCoherenceGauge
                  value={metrics.resonance}
                  label="Resonance"
                  color="violet"
                  className="h-32"
                />
                <QuantumCoherenceGauge
                  value={metrics.consciousness}
                  label="Consciousness"
                  color="emerald"
                  className="h-32"
                />
              </div>
            </div>

            {/* Interaction Controls */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleQuantumInteraction}
              className="w-full py-4 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 
                       text-white font-semibold transition-colors"
            >
              Stabilize Quantum Field
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CyberpunkQuantumVault;