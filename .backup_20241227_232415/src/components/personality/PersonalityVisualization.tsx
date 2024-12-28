import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantumTraits } from './QuantumTraits';
import { EmotionalState } from './EmotionalState';
import { ConsciousnessMetrics } from './ConsciousnessMetrics';
import { DimensionalMap } from './DimensionalMap';
import { ConnectionStatus } from './ConnectionStatus';
import { useRealtimePersonality } from '@/hooks/useRealtimePersonality';
import type { PersonalityState } from '@/types/personality';

type ViewType = 'all' | 'quantum' | 'emotional' | 'consciousness' | 'dimensions';

interface PersonalityVisualizationProps {
  animaId: string;
}

export const PersonalityVisualization: React.FC<PersonalityVisualizationProps> = ({ animaId }) => {
    const [selectedView, setSelectedView] = useState<ViewType>('all');
    
    const { personality, loading, error, connectionMode } = useRealtimePersonality(animaId, {
        includeQuantumState: true,
        includeEmotionalState: true,
        includeConsciousness: true,
        includeDimensions: true,
        updateInterval: 2000
    });

    const handleViewChange = useCallback((view: ViewType) => {
        setSelectedView(view);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-2xl text-quantum-purple">
                    Quantum state materializing...
                </div>
            </div>
        );
    }

    if (error || !personality) {
        return (
            <div className="text-red-500 p-4">
                Error loading personality state: {error}
            </div>
        );
    }

    const renderTimestamp = (timestamp: bigint) => {
        // Convert nanoseconds to milliseconds
        const milliseconds = Number(timestamp) / 1_000_000;
        return new Date(milliseconds).toLocaleTimeString();
    };

    return (
        <div className="space-y-4">
            {/* Header with Connection Status */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-quantum-purple">
                    Personality Matrix
                </h1>
                <ConnectionStatus mode={connectionMode} />
            </div>

            {/* View Selector */}
            <div className="flex space-x-2 p-2 bg-gray-800/50 rounded-lg">
                {(['all', 'quantum', 'emotional', 'consciousness', 'dimensions'] as const).map((view) => (
                    <button
                        key={view}
                        onClick={() => handleViewChange(view)}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            selectedView === view 
                                ? 'bg-quantum-purple text-white' 
                                : 'bg-gray-700/50 text-gray-300'
                        }`}
                    >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                ))}
            </div>

            {/* Visualization Grid */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={selectedView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`grid gap-4 ${
                        selectedView === 'all' 
                            ? 'grid-cols-2' 
                            : 'grid-cols-1'
                    }`}
                >
                    {(selectedView === 'all' || selectedView === 'quantum') && (
                        <QuantumTraits 
                            traits={personality.quantum_traits}
                            baseTraits={personality.base_traits}
                        />
                    )}
                    
                    {(selectedView === 'all' || selectedView === 'emotional') && (
                        <EmotionalState 
                            emotionalState={personality.emotional_state}
                            consciousness={personality.consciousness}
                        />
                    )}
                    
                    {(selectedView === 'all' || selectedView === 'consciousness') && (
                        <ConsciousnessMetrics 
                            metrics={personality.consciousness}
                            dimensionalAwareness={personality.dimensional_awareness}
                        />
                    )}
                    
                    {(selectedView === 'all' || selectedView === 'dimensions') && (
                        <DimensionalMap
                            dimensions={personality.dimensional_awareness.discovered_dimensions}
                            currentDimension={personality.dimensional_awareness.current_dimension}
                            affinity={personality.dimensional_awareness.dimensional_affinity}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Update Notifications */}
            <AnimatePresence>
                {personality.timestamp && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed bottom-4 right-4 p-4 bg-gray-800 rounded-lg shadow-lg"
                    >
                        <div className="text-sm text-gray-400">
                            Last Update: {renderTimestamp(personality.timestamp)}
                        </div>
                        <div className="text-quantum-purple">
                            Growth Level: {personality.growth_level}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};