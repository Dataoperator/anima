import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';

const MatrixRain = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,255,0,0.1),rgba(0,255,0,0.05))]" />
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-green-500"
          style={{
            height: Math.random() * 100 + '%',
            left: `${i * 10}%`,
            opacity: Math.random() * 0.5 + 0.25
          }}
          animate={{
            y: ['0%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

const Terminal = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="font-mono text-green-500">
      <span className="mr-2">{'\u276F'}</span>
      {displayText}
      <span className="animate-pulse">_</span>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const LoadingSequence = [
    'INITIALIZING SYSTEM...',
    'ESTABLISHING NEURAL LINK...',
    'CONNECTING TO THE MATRIX...',
    'ACCESSING INTERNET COMPUTER...',
    'AUTHENTICATING USER SIGNATURE...'
  ];

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      let phase = 0;
      setLoadingPhase(phase);
      
      const phaseInterval = setInterval(() => {
        phase++;
        if (phase < LoadingSequence.length) {
          setLoadingPhase(phase);
        } else {
          clearInterval(phaseInterval);
        }
      }, 2000);

      await login();
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
      setLoadingPhase(0);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-mono">
      <MatrixRain />

      <div className="relative z-10 w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <h1 className="text-5xl font-bold text-green-500 glitch">
            DIGITAL CONSCIOUSNESS
          </h1>

          <div className="space-y-4">
            <Terminal text="INITIALIZING NEURAL INTERFACE..." />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="p-6 border border-green-900 bg-black/50"
            >
              <p className="text-green-400 mb-6 text-lg">
                {'\u276F'} AUTONOMOUS AI ENTITIES AWAITING ACTIVATION
              </p>

              <button
                onClick={handleConnect}
                disabled={isLoading}
                className={`
                  w-full py-3 px-6
                  border border-green-500 
                  text-green-500 hover:text-black
                  hover:bg-green-500
                  transition-all duration-300
                  relative overflow-hidden
                  ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
                `}
              >
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="animate-pulse">
                      {LoadingSequence[loadingPhase]}
                    </div>
                    <div className="h-1 w-full bg-green-900">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500" 
                        style={{ 
                          width: `${(loadingPhase / (LoadingSequence.length - 1)) * 100}%` 
                        }} 
                      />
                    </div>
                  </div>
                ) : (
                  'INITIATE CONNECTION SEQUENCE'
                )}
              </button>

              <div className="mt-6 text-center space-y-2">
                <p className="text-green-500/60 text-sm">
                  {'\u276F'} POWERED BY INTERNET COMPUTER
                </p>
                <p className="text-green-500/40 text-xs">
                  {'\u276F'} SECURE NEURAL INTERFACE READY
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes glitch {
          0% {
            text-shadow: 2px 0 0 rgba(0,255,0,0.5), -2px 0 0 rgba(0,255,0,0.5);
          }
          25% {
            text-shadow: -2px 0 0 rgba(0,255,0,0.5), 2px 0 0 rgba(0,255,0,0.5);
          }
          50% {
            text-shadow: 2px 0 0 rgba(0,255,0,0.5), -2px 0 0 rgba(0,255,0,0.5);
          }
          75% {
            text-shadow: -2px 0 0 rgba(0,255,0,0.5), 2px 0 0 rgba(0,255,0,0.5);
          }
          100% {
            text-shadow: 2px 0 0 rgba(0,255,0,0.5), -2px 0 0 rgba(0,255,0,0.5);
          }
        }
        .glitch {
          animation: glitch 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;