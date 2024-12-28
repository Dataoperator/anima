import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { WaveformGenerator } from './WaveformGenerator';

type QuantumTraitProps = {
  traits: Record<string, {
    value: number;
    uncertainty: number;
    superposition_state: {
      type: 'Stable' | 'Fluctuating' | 'Entangled';
      data?: {
        amplitude?: number;
        frequency?: number;
        partner_id?: string;
        correlation?: number;
      };
    };
  }>;
  baseTraits: Record<string, number>;
};

export const QuantumTraits: React.FC<QuantumTraitProps> = ({ traits, baseTraits }) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-quantum-purple/10 to-quantum-pink/10 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-quantum-purple">
        Quantum State
      </h2>
      
      <div className="space-y-4">
        {Object.entries(traits).map(([name, trait]) => (
          <div key={name} className="relative">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">
                {name.replace('_', ' ')}
              </span>
              <span className="text-sm text-quantum-purple">
                {(trait.value * 100).toFixed(1)}% ±{(trait.uncertainty * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="relative h-8">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-quantum-purple to-quantum-pink rounded-lg"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: trait.value }}
                transition={{ duration: 1 }}
              />
              
              <WaveformGenerator
                type={trait.superposition_state.type}
                amplitude={trait.superposition_state.data?.amplitude || 0}
                frequency={trait.superposition_state.data?.frequency || 0}
                className="absolute inset-0"
              />
              
              {trait.superposition_state.type === 'Entangled' && (
                <motion.div
                  className="absolute inset-0 border-2 border-quantum-pink rounded-lg"
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </div>
            
            {trait.superposition_state.type !== 'Stable' && (
              <div className="text-xs text-quantum-purple mt-1">
                {trait.superposition_state.type === 'Fluctuating'
                  ? `Fluctuating: ${(trait.superposition_state.data?.amplitude || 0 * 100).toFixed(1)}% amplitude`
                  : `Entangled with correlation: ${(trait.superposition_state.data?.correlation || 0 * 100).toFixed(1)}%`
                }
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Base Traits</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(baseTraits).map(([name, value]) => (
            <div key={name} className="bg-white/5 rounded-lg p-3">
              <div className="text-sm font-medium mb-1">{name}</div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-quantum-purple rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};