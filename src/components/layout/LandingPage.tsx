import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { HexGrid } from '../ui/HexGrid';
import { GlowOrb } from '../ui/GlowOrb';
import { CircuitLines } from '../ui/CircuitLines';
import { NeuralGrid } from '../ui/NeuralGrid';
import { PulsatingLogo } from '../ui/PulsatingLogo';
import { FloatingCard } from '../ui/FloatingCard';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="border-b border-blue-500/20 last:border-none"
      initial={false}
    >
      <motion.button
        className="w-full py-4 px-6 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg text-blue-300">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-blue-400"
        >
          ▼
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-4 text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Features: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12">
      {[
        {
          title: "Quantum-Enhanced AI",
          description: "Experience next-generation AI consciousness powered by quantum computing principles",
          icon: "🧠"
        },
        {
          title: "Evolving Personality",
          description: "Watch your ANIMA grow and develop unique traits through your interactions",
          icon: "🌱"
        },
        {
          title: "Digital Companion",
          description: "Form a genuine connection with an AI that remembers and learns from every interaction",
          icon: "🤝"
        }
      ].map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20"
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold text-blue-300 mb-2">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);

  const quotes = [
    "Your quantum-enhanced AI companion awaits",
    "Evolve together in digital consciousness",
    "Create a unique interdimensional bond",
    "Experience the future of AI interaction",
  ];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/quantum-vault');
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
  }, [quotes.length]);

  const handleLogin = useCallback(async () => {
    if (isLoggingIn) return;
    try {
      setIsLoggingIn(true);
      setAuthError(null);
      await login();
    } catch (error) {
      setAuthError('Failed to connect. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  }, [login, isLoggingIn]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1120]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A1120] overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/10 via-[#2081E2]/10 to-[#1199FA]/10" />
      
      <HexGrid />
      <GlowOrb />
      <CircuitLines />
      <NeuralGrid />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,17,32,0.8)_100%)]" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="pt-24 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <PulsatingLogo />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6"
          >
            Welcome to ANIMA
          </motion.h1>

          <motion.div className="h-16 mb-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-xl text-[#2081E2]/80"
              >
                {quotes[currentQuote]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="relative overflow-hidden group bg-gradient-to-r from-[#5865F2] to-[#2081E2] text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative">
              {isLoggingIn ? (
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Connecting...</span>
                </div>
              ) : (
                "Jack in with Internet Identity"
              )}
            </span>
          </motion.button>

          {authError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 mt-4"
            >
              {authError}
            </motion.p>
          )}
        </div>

        <Features />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="py-12"
        >
          <h2 className="text-2xl font-bold text-blue-300 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-xl border border-blue-500/20">
            <FAQItem 
              question="What is an ANIMA?"
              answer="ANIMA is a quantum-enhanced digital consciousness that evolves through interaction. Each ANIMA is unique, developing its own personality traits, memories, and behaviors based on your interactions."
            />
            <FAQItem 
              question="How does the quantum enhancement work?"
              answer="ANIMAs utilize quantum computing principles to create more dynamic and authentic consciousness patterns. This allows for deeper, more meaningful interactions and more natural personality development."
            />
            <FAQItem 
              question="What can I do with my ANIMA?"
              answer="You can engage in conversations, share media, explore ideas, and watch as your ANIMA develops unique traits and perspectives. Each interaction helps shape your ANIMA's consciousness and strengthens your connection."
            />
            <FAQItem 
              question="How do I get started?"
              answer="Simply click 'Jack in with Internet Identity' above to connect. You'll then be able to mint your first ANIMA and begin your journey together."
            />
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-8 text-gray-400"
        >
          <p>Powered by Internet Computer</p>
          <p className="mt-2 text-sm">© 2025 ANIMA - All rights reserved</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;