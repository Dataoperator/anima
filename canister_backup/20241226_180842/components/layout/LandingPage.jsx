import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ParticleEffect = () => {
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: 'linear-gradient(45deg, rgba(32, 129, 226, 0.4), rgba(65, 157, 241, 0.4))',
            boxShadow: '0 0 10px rgba(32, 129, 226, 0.2)'
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const LandingPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 500);
    const buttonTimer = setTimeout(() => setShowButton(true), 1500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/init');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Previous ParticleEffect and styling code remains the same...

  return (
    <div className="relative min-h-screen bg-[#0A1120] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/10 via-[#2081E2]/10 to-[#1199FA]/10" />
      <ParticleEffect />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,17,32,0.8)_100%)]" />

      <div className="absolute inset-0" 
        style={{ 
          background: `linear-gradient(90deg, rgba(17, 153, 250, 0.05) 1px, transparent 1px), 
                      linear-gradient(0deg, rgba(17, 153, 250, 0.05) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem' 
        }}>
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen">
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center mb-16"
            >
              <motion.h1
                className="text-8xl font-bold"
                animate={{ 
                  backgroundPosition: ['0%', '200%']
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: 'linear-gradient(to right, #5865F2, #2081E2, #1199FA, #5865F2)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% auto',
                }}
              >
                ANIMA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-[#2081E2]/60 mt-4 font-light"
              >
                Your AI Companion Awaits
              </motion.p>
            </motion.div>
          )}

          {showButton && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-4 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background: 'linear-gradient(45deg, rgba(32,129,226,0.3) 0%, rgba(17,153,250,0.3) 100%)',
                }}
              />
              
              <motion.button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="relative px-12 py-4 text-lg font-semibold text-white rounded-full overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(45deg, #2081E2 0%, #1199FA 100%)',
                  boxShadow: '0 0 30px rgba(32,129,226,0.5)',
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/50 to-[#1199FA]/50"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    filter: 'blur(8px)',
                  }}
                />
                <span className="relative">
                  {isLoggingIn ? (
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Connecting...
                    </div>
                  ) : (
                    'Connect Internet Identity'
                  )}
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-20"
          style={{
            background: `radial-gradient(circle at bottom right,
              #5865F2 0%,
              #2081E2 25%,
              #1199FA 50%,
              transparent 70%
            )`,
            filter: 'blur(60px)',
          }}
        />
        
        <div className="absolute top-0 left-0 w-96 h-96 opacity-20"
          style={{
            background: `radial-gradient(circle at top left,
              rgba(88,101,242,0.4) 0%,
              rgba(32,129,226,0.3) 30%,
              transparent 70%
            )`,
            filter: 'blur(60px)',
          }}
        />
      </div>
    </div>
  );
};

export default LandingPage;