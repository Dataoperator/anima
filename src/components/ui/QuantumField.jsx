import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 100;
const MAX_DEPTH = 500;

class QuantumParticle {
  constructor(width, height) {
    this.reset(width, height);
    this.z = Math.random() * MAX_DEPTH;
  }

  reset(width, height) {
    this.x = (Math.random() - 0.5) * width;
    this.y = (Math.random() - 0.5) * height;
    this.z = MAX_DEPTH;
    this.phase = Math.random() * Math.PI * 2;
    this.quantumState = Math.random();
    this.entangled = Math.random() < 0.3;
    this.entangledWith = null;
  }

  update(width, height, deltaTime) {
    this.z -= 200 * deltaTime;
    this.phase += deltaTime * 2;
    
    if (this.z < -50) {
      this.reset(width, height);
    }

    // Quantum fluctuations
    this.quantumState = (this.quantumState + Math.sin(this.phase) * 0.1) % 1;
  }
}

export const QuantumField = ({ className = '', intensity = 1.0 }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Initialize particles
    particlesRef.current = Array(PARTICLE_COUNT)
      .fill()
      .map(() => new QuantumParticle(width, height));

    // Create entangled pairs
    for (let i = 0; i < particlesRef.current.length; i += 2) {
      if (particlesRef.current[i].entangled) {
        particlesRef.current[i].entangledWith = particlesRef.current[i + 1];
        particlesRef.current[i + 1].entangledWith = particlesRef.current[i];
      }
    }

    // Animation loop
    const animate = (timestamp) => {
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(width, height, deltaTime);

        const scale = MAX_DEPTH / (MAX_DEPTH + particle.z);
        const x = particle.x * scale;
        const y = particle.y * scale;
        
        // Particle size based on depth and quantum state
        const size = (scale * 3 + particle.quantumState * 2) * intensity;
        
        // Quantum glow effect
        ctx.shadowColor = particle.entangled ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 128, 255, 0.5)';
        ctx.shadowBlur = size * 2;
        
        // Draw quantum particle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        
        const alpha = (0.5 + particle.quantumState * 0.5) * intensity;
        ctx.fillStyle = particle.entangled 
          ? `rgba(0, 255, 255, ${alpha})`
          : `rgba(0, 128, 255, ${alpha})`;
        ctx.fill();

        // Draw quantum field lines
        if (particle.entangledWith) {
          const other = particle.entangledWith;
          const otherScale = MAX_DEPTH / (MAX_DEPTH + other.z);
          const ox = other.x * otherScale;
          const oy = other.y * otherScale;

          // Quantum entanglement visualization
          const gradient = ctx.createLinearGradient(x, y, ox, oy);
          gradient.addColorStop(0, `rgba(0, 255, 255, ${0.3 * intensity})`);
          gradient.addColorStop(0.5, `rgba(0, 255, 255, ${0.1 * intensity})`);
          gradient.addColorStop(1, `rgba(0, 128, 255, ${0.3 * intensity})`);

          // Draw entanglement line
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ox, oy);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Quantum interference pattern
          const midX = (x + ox) / 2;
          const midY = (y + oy) / 2;
          const phase = (particle.phase + other.phase) / 2;
          
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const t = i / 9;
            const wave = Math.sin(phase + t * Math.PI * 4) * 10;
            ctx.lineTo(
              x + (ox - x) * t + Math.cos(phase) * wave,
              y + (oy - y) * t + Math.sin(phase) * wave
            );
          }
          ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * intensity})`;
          ctx.stroke();
        }
      });

      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate(0);

    // Cleanup
    return () => {
      cancelAnimationFrame(animate);
    };
  }, [intensity]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
};