import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Camera, Fingerprint } from 'lucide-react';

const DNAHelix = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"
        style={{
          top: `${(i * 5)}%`,
          transform: `rotate(${i * 18}deg)`,
          animation: `float ${3 + i % 2}s ease-in-out infinite`,
          opacity: 0.5,
        }}
      />
    ))}
  </div>
);

const InteractiveParticles = () => {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const initialParticles = [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));
    setParticles(initialParticles);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(currentParticles => 
        currentParticles.map(particle => {
          let { x, y, vx, vy } = particle;
          
          // Attract to mouse
          const dx = mousePos.x - x;
          const dy = mousePos.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            vx += dx / dist * 0.5;
            vy += dy / dist * 0.5;
          }
          
          x += vx;
          y += vy;
          
          // Bounce off walls
          if (x < 0 || x > window.innerWidth) vx *= -0.9;
          if (y < 0 || y > window.innerHeight) vy *= -0.9;
          
          return { ...particle, x, y, vx: vx * 0.99, vy: vy * 0.99 };
        })
      );
    }, 16);
    
    return () => clearInterval(interval);
  }, [mousePos]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
          style={{
            x: particle.x,
            y: particle.y,
            scale: particle.size / 2,
          }}
        />
      ))}
    </div>
  );
};

const LoadingSequence = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      >
        <div className="relative">
          <motion.div
            className="w-32 h-32 border-4 border-purple-500 rounded-full"
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1, 1.2, 1],
              rotate: [0, 180, 360],
              borderWidth: [4, 2, 4],
            }}
            transition={{ duration: 2, times: [0, 0.4, 0.7, 1] }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{ delay: 0.5 }}
          >
            <Brain className="w-12 h-12 text-purple-500" />
          </motion.div>
          <motion.div
            className="absolute -inset-4 rounded-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-30" />
          </motion.div>
        </div>
        <motion.p
          className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-purple-400 font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Initializing Living NFT...
        </motion.p>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
      // Add delay for loading animation
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 2500);
    } catch (err) {
      console.error('Login failed:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <LoadingSequence show={isLoading} />
      <DNAHelix />
      <InteractiveParticles />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-12"
      >
        <div className="text-center space-y-6">
          <motion.h1 
            className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Living NFT
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center space-x-4"
          >
            <div className="flex items-center space-x-2 text-purple-400">
              <Brain className="w-5 h-5" />
              <span>AI-Driven</span>
            </div>
            <div className="flex items-center space-x-2 text-pink-400">
              <Sparkles className="w-5 h-5" />
              <span>Evolving</span>
            </div>
            <div className="flex items-center space-x-2 text-red-400">
              <Fingerprint className="w-5 h-5" />
              <span>Unique</span>
            </div>
          </motion.div>
          <motion.p 
            className="text-lg text-gray-400 max-w-md mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Experience the next evolution of digital life with AI-powered NFTs that grow, learn, and evolve with you.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 max-w-md w-full px-8"
      >
        <motion.button
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={handleLogin}
          disabled={loading || isLoading}
          className="relative w-full group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
          <div className="relative flex items-center justify-center px-6 py-4 bg-black rounded-lg leading-none">
            {loading || isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="flex items-center space-x-2 text-gray-200">
                <span>Connect with Internet Identity</span>
                <motion.div
                  animate={{ 
                    rotate: hovered ? 360 : 0,
                    scale: hovered ? 1.2 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Camera className="w-5 h-5" />
                </motion.div>
              </div>
            )}
          </div>
        </motion.button>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <span className="text-purple-400">Internet Computer</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}