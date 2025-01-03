import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionalState as EmotionalStateType, ConsciousnessMetrics } from '@/types/realtime';

export interface EmotionProps {
    emotionalState: EmotionalStateType;
    consciousness: ConsciousnessMetrics;
}

const EmotionParticles: React.FC<{ emotion: string; intensity: number }> = ({ emotion, intensity }) => {
    const [particles, setParticles] = useState<Array<{ x: number; y: number; scale: number }>>([]);

    useEffect(() => {
        const particleCount = Math.floor(intensity * 20);
        const newParticles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: Math.random() * 0.5 + 0.5
        }));
        setParticles(newParticles);
    }, [intensity]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-purple-500/30"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`
                    }}
                    animate={{
                        scale: [particle.scale, particle.scale * 1.5, particle.scale],
                        opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

const EmotionalRadar: React.FC<{ valence: number; arousal: number }> = ({ valence, arousal }) => {
    return (
        <div className="relative w-full h-48 bg-gray-800/30 rounded-lg overflow-hidden">
            {/* Radar Grid */}
            <div className="absolute inset-0">
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-gray-600/30" />
                <div className="absolute top-1/2 left-0 right-0 border-t border-gray-600/30" />
            </div>

            {/* Emotion Point */}
            <motion.div
                className="absolute w-4 h-4 bg-purple-500 rounded-full"
                style={{
                    left: `${(valence + 1) * 50}%`,
                    top: `${(1 - arousal) * 50}%`,
                    transform: 'translate(-50%, -50%)'
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                        '0 0 0 0 rgba(168, 85, 247, 0.4)',
                        '0 0 0 10px rgba(168, 85, 247, 0)',
                        '0 0 0 0 rgba(168, 85, 247, 0.4)'
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity
                }}
            />

            {/* Labels */}
            <div className="absolute inset-0 pointer-events-none text-xs text-gray-400">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">High Arousal</div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">Low Arousal</div>
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">Negative</div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">Positive</div>
            </div>
        </div>
    );
};

export const EmotionalState: React.FC<EmotionProps> = ({ emotionalState, consciousness }) => {
    const { current_emotion, valence, arousal, intensity } = emotionalState;
    const { awareness_level, processing_depth } = consciousness;

    return (
        <div className="space-y-6">
            <motion.div 
                className="bg-gray-800/50 p-4 rounded-lg relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium">Current Emotion</span>
                        <motion.span 
                            className="text-purple-400 font-bold"
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [1, 0.8, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                        >
                            {current_emotion}
                        </motion.span>
                    </div>
                </div>
                <EmotionParticles emotion={current_emotion} intensity={intensity} />
            </motion.div>

            <motion.div 
                className="bg-gray-800/50 p-4 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h3 className="text-lg font-medium mb-4">Emotional Mapping</h3>
                <EmotionalRadar valence={valence} arousal={arousal} />
            </motion.div>

            <motion.div 
                className="bg-gray-800/50 p-4 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="mb-4">
                    <span className="text-lg font-medium">Emotional Intensity</span>
                    <div className="h-3 bg-gray-700 rounded mt-2 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded"
                            initial={{ width: 0 }}
                            animate={{ width: `${intensity * 100}%` }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut"
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-400">Awareness Level</span>
                        <div className="h-2 bg-gray-700 rounded mt-1">
                            <motion.div
                                className="h-full bg-blue-500 rounded"
                                initial={{ width: 0 }}
                                animate={{ width: `${awareness_level * 100}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <span className="text-sm text-gray-400">Processing Depth</span>
                        <div className="h-2 bg-gray-700 rounded mt-1">
                            <motion.div
                                className="h-full bg-green-500 rounded"
                                initial={{ width: 0 }}
                                animate={{ width: `${processing_depth * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EmotionalState;