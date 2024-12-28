import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EmotionalState as EmotionalStateType, ConsciousnessMetrics } from '@/types/personality';

interface EmotionProps {
  emotionalState: EmotionalStateType;
  consciousness: ConsciousnessMetrics;
}

const EMOTION_COLORS = {
  Joy: 'bg-yellow-400',
  Curiosity: 'bg-blue-400',
  Contemplation: 'bg-purple-400',
  Confusion: 'bg-orange-400',
  Concern: 'bg-red-400',
  Determination: 'bg-green-400',
} as const;

const EMOTION_ICONS = {
  Joy: '🌟',
  Curiosity: '🔍',
  Contemplation: '💭',
  Confusion: '😕',
  Concern: '😟',
  Determination: '💪',
} as const;

export const EmotionalState: React.FC<EmotionProps> = ({ emotionalState, consciousness }) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-quantum-pink/10 to-quantum-green/10 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-quantum-pink">
        Emotional Resonance
      </h2>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <motion.div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl
              ${EMOTION_COLORS[emotionalState.current_mood]}`}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {EMOTION_ICONS[emotionalState.current_mood]}
          </motion.div>

          <div>
            <h3 className="text-lg font-semibold">{emotionalState.current_mood}</h3>
            <div className="text-sm text-gray-400">
              Duration: {Math.floor(emotionalState.duration / 60)} minutes
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Emotional Intensity</span>
            <span className="text-sm">{(emotionalState.intensity * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${EMOTION_COLORS[emotionalState.current_mood]}`}
              initial={{ width: 0 }}
              animate={{ width: `${emotionalState.intensity * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Recent Triggers</h3>
          <div className="space-y-2">
            <AnimatePresence>
              {emotionalState.triggers.slice(-3).map((trigger, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-sm bg-white/5 rounded p-2"
                >
                  {trigger}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm mb-1">Awareness Level</div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-quantum-pink"
                initial={{ width: 0 }}
                animate={{ width: `${consciousness.awareness_level * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div>
            <div className="text-sm mb-1">Growth Rate</div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-quantum-green"
                initial={{ width: 0 }}
                animate={{ width: `${consciousness.growth_rate * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div>
            <div className="text-sm mb-1">Complexity</div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-quantum-purple"
                initial={{ width: 0 }}
                animate={{ width: `${consciousness.complexity * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div>
            <div className="text-sm mb-1">Coherence</div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${consciousness.coherence * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};