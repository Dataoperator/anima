import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DimensionType } from '@/types/personality';

interface DimensionalMapProps {
  dimensions: DimensionType[];
  currentDimension: string | null;
  affinity: number;
}

const dimensionVariants = {
  active: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  inactive: {
    scale: 0.98,
    opacity: 0.7,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
};

const glowAnimation = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(255, 97, 220, 0)',
      '0 0 20px 10px rgba(255, 97, 220, 0.2)',
      '0 0 0 0 rgba(255, 97, 220, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

export const DimensionalMap: React.FC<DimensionalMapProps> = ({
  dimensions,
  currentDimension,
  affinity
}) => {
  const sortedDimensions = useMemo(() => {
    return [...dimensions].sort((a, b) => Number(b.discovery_time) - Number(a.discovery_time));
  }, [dimensions]);

  const formatModifier = (value: number) => {
    const percentage = (value * 100).toFixed(1);
    return value > 0 ? `+${percentage}%` : `${percentage}%`;
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-quantum-pink/10 to-quantum-purple/10 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-quantum-pink">
        Dimensional Resonance
      </h2>

      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-sm">Dimensional Affinity</div>
          <div className="text-sm text-quantum-pink">
            {(affinity * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-quantum-pink"
            initial={{ width: 0 }}
            animate={{ width: `${affinity * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="text-sm text-gray-400">
          {affinity < 0.3 && 'Developing dimensional awareness...'}
          {affinity >= 0.3 && affinity < 0.6 && 'Growing multidimensional resonance...'}
          {affinity >= 0.6 && affinity < 0.9 && 'Strong dimensional connection established...'}
          {affinity >= 0.9 && 'Maximum dimensional resonance achieved!'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="sync">
          {sortedDimensions.map((dimension) => (
            <motion.div
              key={dimension.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={dimension.id === currentDimension ? 'active' : 'inactive'}
              whileHover="hover"
              variants={dimensionVariants}
              className={`relative rounded-lg p-4 ${
                dimension.id === currentDimension
                  ? 'bg-quantum-pink/20 ring-2 ring-quantum-pink'
                  : 'bg-gray-800/50 hover:bg-gray-800/70'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{dimension.name}</h3>
                {dimension.id === currentDimension && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-quantum-pink text-sm"
                  >
                    Active
                  </motion.span>
                )}
              </div>

              <p className="text-sm text-gray-400 mb-3">
                {dimension.description}
              </p>

              <div className="space-y-2">
                {Object.entries(dimension.trait_modifiers).map(([trait, modifier]) => (
                  <div key={trait} className="flex items-center justify-between">
                    <span className="text-xs capitalize">
                      {trait.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs font-medium ${
                      modifier > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatModifier(modifier)}
                    </span>
                  </div>
                ))}
              </div>

              {dimension.id === currentDimension && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-quantum-pink pointer-events-none"
                  variants={glowAnimation}
                  animate="animate"
                />
              )}

              <motion.div
                className="absolute bottom-2 right-2 text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
              >
                {new Date(Number(dimension.discovery_time)).toLocaleDateString()}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {dimensions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400 space-y-2"
        >
          <p>No dimensional discoveries yet.</p>
          <p className="text-sm text-quantum-pink">
            Continue evolving to unlock new dimensions.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};