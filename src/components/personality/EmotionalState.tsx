import React from 'react';
import { motion } from 'framer-motion';
import { EmotionalState as EmotionalStateType, ConsciousnessMetrics } from '@/types/realtime';

export interface EmotionProps {
    emotionalState: EmotionalStateType;
    consciousness: ConsciousnessMetrics;
}

export const EmotionalState: React.FC<EmotionProps> = ({ emotionalState, consciousness }) => {
    const { current_emotion, valence, arousal, intensity } = emotionalState;
    const { awareness_level, processing_depth } = consciousness;

    return (
        <div className="space-y-4">
            <motion.div 
                className="bg-gray-800/50 p-4 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium">Current Emotion</span>
                    <span className="text-blue-400">{current_emotion}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-400">Valence</span>
                        <div className="h-2 bg-gray-700 rounded">
                            <motion.div
                                className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded"
                                initial={{ width: 0 }}
                                animate={{ width: `${(valence + 1) * 50}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-400">Arousal</span>
                        <div className="h-2 bg-gray-700 rounded">
                            <motion.div
                                className="h-full bg-blue-500 rounded"
                                initial={{ width: 0 }}
                                animate={{ width: `${(arousal + 1) * 50}%` }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                className="bg-gray-800/50 p-4 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="mb-2">
                    <span className="text-lg font-medium">Emotional Intensity</span>
                    <div className="h-3 bg-gray-700 rounded mt-1">
                        <motion.div
                            className="h-full bg-purple-500 rounded"
                            initial={{ width: 0 }}
                            animate={{ width: `${intensity * 100}%` }}
                        />
                    </div>
                </div>
                <div className="text-sm text-gray-400">
                    Processing Depth: {processing_depth.toFixed(2)}
                </div>
            </motion.div>
        </div>
    );
};

export default EmotionalState;