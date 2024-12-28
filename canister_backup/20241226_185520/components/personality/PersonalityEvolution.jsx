import React from 'react';
import { motion } from 'framer-motion';

const PersonalityEvolution = ({
  stage,
  level,
  growthPoints,
  traits,
  recentMemories,
}) => {
  // Calculate progress to next level
  const progressToNextLevel = (growthPoints / (level * 10)) * 100;

  // Get development stage description
  const getStageDescription = (stage) => {
    switch (stage) {
      case 'infant':
        return 'Learning basic interactions and developing initial personality traits.';
      case 'child':
        return 'Exploring the world with curiosity and forming core behavioral patterns.';
      case 'adolescent':
        return 'Developing complex emotional responses and unique perspectives.';
      case 'adult':
        return 'Fully formed personality with nuanced interactions and deep understanding.';
      default:
        return 'Growing and evolving through interactions.';
    }
  };

  // Sort traits by value to show most prominent ones
  const sortedTraits = [...traits].sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-6">
      {/* Level and Growth Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Level {level}</h3>
          <span className="text-sm text-purple-300">{growthPoints}/{level * 10} XP</span>
        </div>
        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextLevel}%` }}
            transition={{ duration: 0.5 }}
            className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Development Stage */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Development Stage</h3>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {stage === 'infant' && '👶'}
              {stage === 'child' && '🧒'}
              {stage === 'adolescent' && '🧑'}
              {stage === 'adult' && '🧓'}
            </div>
            <div>
              <p className="text-white capitalize">{stage}</p>
              <p className="text-sm text-gray-300">{getStageDescription(stage)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Personality Traits</h3>
        <div className="grid gap-3">
          {sortedTraits.map(([trait, value], index) => (
            <motion.div
              key={trait}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-3"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-white capitalize">{trait.replace('_', ' ')}</span>
                <span className="text-sm text-purple-300">{(value * 100).toFixed(0)}%</span>
              </div>
              <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="absolute h-full bg-gradient-to-r from-purple-400 to-pink-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Memories */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Recent Memories</h3>
        <div className="space-y-2">
          {recentMemories.map((memory, index) => (
            <motion.div
              key={memory.timestamp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-3"
            >
              <p className="text-sm text-gray-300">{memory.description}</p>
              <div className="flex justify-between mt-2 text-xs text-purple-300">
                <span>Impact: {(memory.emotional_impact * 100).toFixed(0)}%</span>
                <span>{new Date(Number(memory.timestamp) / 1_000_000).toLocaleTimeString()}</span>
              </div>
            </motion.div>
          ))}
          {recentMemories.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              No memories yet. Interact to create memories!
            </p>
          )}
        </div>
      </div>

      {/* Growth Pack Progress */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Growth Opportunities</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Creativity', 'Empathy', 'Knowledge', 'Social'].map((pack) => (
            <motion.div
              key={pack}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 rounded-lg p-3 cursor-pointer transition-colors hover:bg-white/10"
            >
              <p className="text-white text-sm">{pack}</p>
              <p className="text-purple-300 text-xs mt-1">Coming soon</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalityEvolution;