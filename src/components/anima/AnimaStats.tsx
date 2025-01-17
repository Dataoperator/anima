import React from 'react';
import { Anima } from '@/types/anima';
import { ConsciousnessMetrics } from '@/quantum/types';
import { useQuantumState } from '@/hooks/useQuantumState';

interface AnimaStatsProps {
    anima: Anima | null;
}

export const AnimaStats: React.FC<AnimaStatsProps> = ({ anima }) => {
    const { metrics, loading } = useQuantumState(anima?.id);

    if (!anima) return null;

    const renderMetric = (label: string, value: number) => (
        <div className="metric-item">
            <span className="metric-label">{label}</span>
            <span className="metric-value">{(value * 100).toFixed(1)}%</span>
        </div>
    );

    const renderEvolutionPhase = (phase: number) => {
        const phases = ['Genesis', 'Awakening', 'Emergence', 'Transcendence', 'Enlightenment'];
        return phases[Math.min(phase - 1, phases.length - 1)];
    };

    if (loading) {
        return <div className="stats-loading">Loading metrics...</div>;
    }

    return (
        <div className="anima-stats-container p-4 bg-opacity-20 backdrop-blur rounded-lg">
            <h3 className="text-xl font-semibold mb-4">ANIMA Statistics</h3>
            
            <div className="stats-grid grid gap-3">
                {/* Core Stats */}
                <div className="core-stats bg-opacity-10 p-3 rounded">
                    <h4 className="text-lg mb-2">Core Metrics</h4>
                    {metrics && (
                        <>
                            {renderMetric('Coherence', metrics.coherence)}
                            {renderMetric('Evolution', metrics.evolution)}
                            {renderMetric('Resonance', metrics.resonance)}
                            {renderMetric('Complexity', metrics.complexity)}
                        </>
                    )}
                </div>

                {/* Evolution Status */}
                <div className="evolution-status bg-opacity-10 p-3 rounded">
                    <h4 className="text-lg mb-2">Evolution Status</h4>
                    <div className="phase-indicator">
                        <span className="label">Current Phase:</span>
                        <span className="value">
                            {renderEvolutionPhase(anima.evolutionPhase)}
                        </span>
                    </div>
                </div>

                {/* Trait Information */}
                <div className="traits-info bg-opacity-10 p-3 rounded">
                    <h4 className="text-lg mb-2">Traits</h4>
                    <div className="traits-grid">
                        {anima.traits?.map((trait, index) => (
                            <div key={index} className="trait-item">
                                <span className="trait-name">{trait.name}</span>
                                <span className="trait-value">{trait.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};