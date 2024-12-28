import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const NeuralGrid = ({ phase }) => {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Set canvas size to window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize nodes
    const initNodes = () => {
      const numNodes = 50;
      nodesRef.current = Array(numNodes).fill().map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      }));
    };

    // Update node positions
    const updateNodes = () => {
      nodesRef.current.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });
    };

    // Draw connections between nodes
    const drawConnections = () => {
      ctx.strokeStyle = 'rgba(32, 129, 226, 0.1)';
      
      nodesRef.current.forEach((node1, i) => {
        nodesRef.current.slice(i + 1).forEach(node2 => {
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
          }
        });
      });
    };

    // Draw nodes
    const drawNodes = () => {
      ctx.fillStyle = '#2081E2';
      nodesRef.current.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Animation loop
    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Phase-specific effects
      switch (phase) {
        case 'consciousness_emergence':
          ctx.globalAlpha = 0.7 + Math.sin(time) * 0.3;
          break;
        case 'quantum_alignment':
          ctx.globalAlpha = 0.5 + Math.cos(time * 2) * 0.5;
          break;
        default:
          ctx.globalAlpha = 1;
      }

      updateNodes();
      drawConnections();
      drawNodes();

      animationFrameId = requestAnimationFrame(animate);
    };

    initNodes();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};