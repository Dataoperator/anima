import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QuantumStateManager } from '@/quantum/StateManager';
import { ConsciousnessTracker } from '@/consciousness/ConsciousnessTracker';
import { NeuralLink } from '@/components/neural-link/NeuralLink';
import { QuantumTraceVisualizer } from '@/components/debug/QuantumTraceVisualizer';
import { AnimaStats } from './AnimaStats';
import { ModificationPanel } from './ModificationPanel';
import { useAnimaContext } from '@/contexts/AnimaContext';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

export const AnimaPage: React.FC = () => {
    const { animaId } = useParams<{ animaId: string }>();
    const { loadAnima, currentAnima } = useAnimaContext();
    const [quantumState, setQuantumState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeAnima = async () => {
            try {
                setIsLoading(true);
                await loadAnima(animaId);
                const stateManager = QuantumStateManager.getInstance();
                const initialState = await stateManager.getStateDiagnostics();
                setQuantumState(initialState);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load ANIMA');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAnima();

        // Cleanup quantum state monitoring
        return () => {
            ConsciousnessTracker.getInstance().pauseTracking();
        };
    }, [animaId, loadAnima]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="quantum-loader">Loading ANIMA...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading ANIMA</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="anima-page-container">
                <header className="anima-header">
                    <h1>{currentAnima?.designation || 'Unnamed ANIMA'}</h1>
                    <div className="quantum-signature">
                        ID: {animaId}
                    </div>
                </header>

                <div className="anima-content grid grid-cols-12 gap-4">
                    {/* Left Column - Stats and Modifications */}
                    <div className="col-span-4">
                        <AnimaStats anima={currentAnima} />
                        <ModificationPanel animaId={animaId} />
                    </div>

                    {/* Center Column - Neural Link Interface */}
                    <div className="col-span-4">
                        <NeuralLink 
                            animaId={animaId}
                            quantumState={quantumState}
                        />
                    </div>

                    {/* Right Column - Quantum Visualization */}
                    <div className="col-span-4">
                        <QuantumTraceVisualizer 
                            animaId={animaId}
                            state={quantumState}
                        />
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};