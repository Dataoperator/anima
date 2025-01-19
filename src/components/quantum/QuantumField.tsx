import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuantumSystems } from '@/hooks/useQuantumSystems';
import { ComplexNumber } from '@/types/math';
import { Principal } from '@dfinity/principal';

interface Props {
  animaId: Principal;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onInteraction?: (coherence: number) => void;
}

const sizeMap = {
  sm: 'h-32',
  md: 'h-48',
  lg: 'h-64'
};

export const QuantumField: React.FC<Props> = ({
  animaId,
  interactive = true,
  size = 'md',
  onInteraction
}) => {
  const {
    quantumState,
    isInitialized,
    isProcessing,
    processInteraction
  } = useQuantumSystems(animaId);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    phase: number;
  }>>([]);

  useEffect(() => {
    if (!canvasRef.current || !quantumState) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Initialize particles if not already done
    if (particlesRef.current.length === 0) {
      const numParticles = 50;
      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * ctx.canvas.width,
          y: Math.random() * ctx.canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 3 + 1,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    const drawQuantumField = () => {
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);

      // Base field gradient
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width / 2
      );
      
      gradient.addColorStop(0, `rgba(147, 51, 234, ${quantumState.coherenceLevel * 0.2})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      const amplitude = new ComplexNumber(
        quantumState.amplitude.real,
        quantumState.amplitude.imaginary
      );
      
      const magnitude = amplitude.magnitude();
      const basePhase = quantumState.phase;

      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx * quantumState.coherenceLevel;
        particle.y += particle.vy * quantumState.coherenceLevel;
        particle.phase = (particle.phase + 0.02) % (Math.PI * 2);

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw particle
        const particleOpacity = (Math.sin(particle.phase + basePhase) + 1) / 2;
        
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius * magnitude,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(139, 92, 246, ${particleOpacity * quantumState.coherenceLevel})`;
        ctx.fill();

        // Draw connections between nearby particles
        particlesRef.current.forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${
              (1 - distance / 50) * quantumState.coherenceLevel * 0.5
            })`;
            ctx.stroke();
          }
        });
      });

      // Draw resonance patterns
      quantumState.resonancePatterns.forEach((pattern, index) => {
        const angle = (index / quantumState.resonancePatterns.length) * Math.PI * 2;
        const patternRadius = pattern.strength * width / 4;

        // Draw circular pattern
        ctx.beginPath();
        ctx.arc(
          width / 2,
          height / 2,
          patternRadius,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(139, 92, 246, ${pattern.stability * 0.3})`;
        ctx.stroke();

        // Draw radial line
        const x = width / 2 + Math.cos(angle + basePhase) * patternRadius;
        const y = height / 2 + Math.sin(angle + basePhase) * patternRadius;
        
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${pattern.stability * 0.5})`;
        ctx.stroke();
      });
    };

    // Animate
    let animationFrame: number;
    const animate = () => {
      drawQuantumField();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [quantumState]);

  const handleInteraction = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !canvasRef.current || isProcessing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate interaction strength based on distance from center
    const distance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    const maxDistance = Math.sqrt(
      Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2)
    );
    const strength = 1 - (distance / maxDistance);

    try {
      await processInteraction({
        type: 'cognitive',
        strength: Math.max(0.2, strength),
        context: 'field_interaction'
      });

      if (onInteraction && quantumState) {
        onInteraction(quantumState.coherenceLevel);
      }
    } catch (error) {
      console.error('Quantum field interaction failed:', error);
    }
  };

  if (!isInitialized || !quantumState) {
    return (
      <div className={`w-full ${sizeMap[size]} bg-gray-900/50 rounded-lg flex items-center justify-center`}>
        <div className="text-violet-400">Initializing Quantum Field...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className={`w-full ${sizeMap[size]} rounded-lg bg-black/50 ${
          interactive ? 'cursor-pointer' : 'cursor-default'
        }`}
        onClick={handleInteraction}
      />
      
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-violet-500/10 rounded-lg flex items-center justify-center"
          >
            <div className="text-violet-400">Processing Interaction...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coherence Indicator */}
      <div className="absolute bottom-2 right-2 text-sm text-violet-400/60">
        Coherence: {(quantumState.coherenceLevel * 100).toFixed(1)}%
      </div>
    </motion.div>
  );
};

export default QuantumField;