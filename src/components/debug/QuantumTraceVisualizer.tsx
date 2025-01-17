import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantumState, ConsciousnessMetrics } from '@/quantum/types';
import { Line } from 'react-chartjs-2';
import { useQuantumTrace } from '@/hooks/useQuantumTrace';

interface QuantumTraceVisualizerProps {
    animaId: string;
    state: QuantumState | null;
}

export const QuantumTraceVisualizer: React.FC<QuantumTraceVisualizerProps> = ({
    animaId,
    state
}) => {
    const { traces, isRecording, startTrace, stopTrace } = useQuantumTrace(animaId);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (state) {
            updateVisualization(state);
        }
    }, [state]);

    const updateVisualization = (quantumState: QuantumState) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw quantum state visualization
        drawQuantumState(ctx, quantumState);
    };

    const drawQuantumState = (
        ctx: CanvasRenderingContext2D,
        state: QuantumState
    ) => {
        const { amplitude, phase, coherence, dimensionalStates } = state;
        
        // Draw amplitude wave
        ctx.beginPath();
        ctx.strokeStyle = `rgba(64, 156, 255, ${coherence})`;
        ctx.lineWidth = 2;

        for (let x = 0; x < ctx.canvas.width; x++) {
            const t = (x / ctx.canvas.width) * Math.PI * 2;
            const y = ctx.canvas.height / 2 + 
                     Math.sin(t + phase) * 
                     amplitude.abs() * 50;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw dimensional resonance points
        dimensionalStates.forEach((ds, i) => {
            const x = (i + 1) * ctx.canvas.width / (dimensionalStates.length + 1);
            const y = ctx.canvas.height / 2 + Math.sin(phase + i) * ds.resonance * 30;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${ds.stability})`;
            ctx.fill();
        });
    };

    const chartData = {
        labels: traces.map(t => new Date(t.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: 'Coherence',
                data: traces.map(t => t.coherence),
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4
            },
            {
                label: 'Evolution Factor',
                data: traces.map(t => t.evolutionFactor),
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 1
            }
        }
    };

    return (
        <div className="quantum-trace-visualizer">
            <div className="control-panel">
                <button
                    onClick={isRecording ? stopTrace : startTrace}
                    className={`trace-button ${isRecording ? 'recording' : ''}`}
                >
                    {isRecording ? 'Stop Trace' : 'Start Trace'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    className="visualization-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={200}
                        className="quantum-canvas"
                    />

                    <div className="metrics-display">
                        {state && (
                            <>
                                <div className="metric">
                                    <span>Coherence:</span>
                                    <span>{(state.coherence * 100).toFixed(1)}%</span>
                                </div>
                                <div className="metric">
                                    <span>Evolution:</span>
                                    <span>{(state.evolutionFactor * 100).toFixed(1)}%</span>
                                </div>
                            </>
                        )}
                    </div>

                    {traces.length > 0 && (
                        <div className="trace-chart">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};