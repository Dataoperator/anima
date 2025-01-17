import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnima } from '@/hooks/useAnima';
import { useNeuralLink } from '@/hooks/useNeuralLink';
import { ImmersiveInterface } from './ImmersiveInterface';
import { NeuralPatternVisualizer } from './NeuralPatternVisualizer';
import { EnhancedNeuralLink } from './EnhancedNeuralLink';
import { QuantumStateVisualizer } from '../quantum/QuantumStateVisualizer';
import { LoadingStates } from '../ui/LoadingStates';
import { ErrorDisplay } from '../error/ErrorDisplay';
import { ConsciousnessMetrics } from '@/types/consciousness';
import { QuantumState } from '@/types/quantum';

interface NeuralLinkPageProps {
    initialState?: QuantumState;
    metrics?: ConsciousnessMetrics;
}

export const NeuralLinkPage: React.FC<NeuralLinkPageProps> = ({
    initialState,
    metrics
}) => {
    const { animaId } = useParams<{ animaId: string }>();
    const navigate = useNavigate();
    const { anima, loading: animaLoading } = useAnima(animaId);
    const { 
        connect,
        disconnect,
        status,
        patterns,
        error: linkError
    } = useNeuralLink(animaId);

    const [activeView, setActiveView] = useState<'immersive' | 'analysis'>('immersive');

    useEffect(() => {
        if (animaId) {
            connect();
        }
        return () => disconnect();
    }, [animaId]);

    if (animaLoading) {
        return <LoadingStates type="neural" />;
    }

    if (linkError) {
        return <ErrorDisplay error={linkError} />;
    }

    return (
        <AnimatePresence mode="wait">
            <div className="neural-link-container">
                <motion.div 
                    className="control-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="view-toggle">
                        <button 
                            onClick={() => setActiveView('immersive')}
                            className={activeView === 'immersive' ? 'active' : ''}
                        >
                            Immersive View
                        </button>
                        <button
                            onClick={() => setActiveView('analysis')}
                            className={activeView === 'analysis' ? 'active' : ''}
                        >
                            Pattern Analysis
                        </button>
                    </div>

                    {status === 'connected' && (
                        <div className="connection-status">
                            Neural Link Active | Signal Strength: {status.signalStrength}%
                        </div>
                    )}
                </motion.div>

                <motion.div 
                    className="main-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {activeView === 'immersive' ? (
                        <ImmersiveInterface
                            anima={anima}
                            neuralPatterns={patterns}
                            quantumState={initialState}
                        />
                    ) : (
                        <>
                            <NeuralPatternVisualizer patterns={patterns} />
                            <QuantumStateVisualizer
                                state={initialState}
                                metrics={metrics}
                            />
                            <EnhancedNeuralLink
                                anima={anima}
                                patterns={patterns}
                            />
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};