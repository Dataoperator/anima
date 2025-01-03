import React, { useRef, useEffect } from 'react';

export const NeuralGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handling
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Neural node class
    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      connections: Node[];

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.connections = [];
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= width) this.vx *= -1;
        if (this.y <= 0 || this.y >= height) this.vy *= -1;
      }
    }

    // Create nodes
    const nodes: Node[] = [];
    const numNodes = 50;
    const connectionDistance = 150;

    for (let i = 0; i < numNodes; i++) {
      nodes.push(new Node(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }

    // Animation
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.1;

      // Update nodes
      nodes.forEach(node => {
        node.update(canvas.width, canvas.height);
        node.connections = [];

        // Find connections
        nodes.forEach(otherNode => {
          if (node === otherNode) return;
          
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            node.connections.push(otherNode);
          }
        });
      });

      // Draw connections
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 0.5;
      nodes.forEach(node => {
        node.connections.forEach(connectedNode => {
          const dx = node.x - connectedNode.x;
          const dy = node.y - connectedNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          ctx.globalAlpha = 1 - (distance / connectionDistance);
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      ctx.fillStyle = '#3B82F6';
      nodes.forEach(node => {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-20"
    />
  );
};