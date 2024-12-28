import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HexGrid } from '@/components/ui/HexGrid';
import { GlowOrb } from '@/components/ui/GlowOrb';
import { CircuitLines } from '@/components/ui/CircuitLines';
import { NeuralGrid } from '@/components/ui/NeuralGrid';
import { PulsatingLogo } from '@/components/ui/PulsatingLogo';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { FloatingCard } from '@/components/ui/FloatingCard';

const LandingPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    "Your AI companion awaits",
    "Evolve together",
    "Create a unique bond",
    "Join the future of AI",
  ];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/init');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A1120] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/10 via-[#2081E2]/10 to-[#1199FA]/10" />
      
      {/* Background Elements */}
      <HexGrid />
      <GlowOrb />
      <CircuitLines />
      <NeuralGrid />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,17,32,0.8)_100%)]" />

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        <AnimatePresence>
          {showContent && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-16 relative"
              >
                <PulsatingLogo />
                
                <motion.div className="mt-8 h-8">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentQuote}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-xl text-[#2081E2]/60 font-light"
                    >
                      {quotes[currentQuote]}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {!isAuthenticated && (
                <FloatingCard delay={0.6}>
                  <EnhancedButton onClick={handleLogin} loading={isLoggingIn}>
                    Connect Internet Identity
                  </EnhancedButton>
                </FloatingCard>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-0 right-0 text-center"
              >
                <p className="text-[#2081E2]/40 text-sm">
                  Powered by Internet Computer
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;