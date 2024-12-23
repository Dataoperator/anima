import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { Brain, Heart, Sparkles, Key } from 'lucide-react';

const InitializationFlow = () => {
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [step, setStep] = useState(0);
  const { initialize, isLoading, error } = useAuth();

  const steps = [
    {
      title: "Welcome to Your Living NFT",
      description: "Create your unique AI companion that grows and evolves with you.",
      icon: Sparkles,
    },
    {
      title: "Name Your Companion",
      description: "Choose a name for your Living NFT. This will be its identity as it grows.",
      icon: Heart,
    },
    {
      title: "Configure OpenAI",
      description: "Enter your OpenAI API key to enable your companion's intelligence.",
      icon: Key,
    },
    {
      title: "Initialize Personality",
      description: "Your companion will start with balanced traits and develop based on your interactions.",
      icon: Brain,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    try {
      await initialize(name, apiKey);
    } catch (err) {
      // Error handling is managed by AuthProvider
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl shadow-xl p-8"
          >
            <div className="flex justify-center mb-6">
              {React.createElement(steps[step].icon, {
                className: "w-12 h-12 text-blue-500",
              })}
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">
              {steps[step].title}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {steps[step].description}
            </p>

            <form onSubmit={handleSubmit}>
              <AnimatePresence>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter a name..."
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                      required
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your OpenAI API key..."
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={(step === 1 && !name.trim()) || (step === 2 && !apiKey.trim()) || isLoading}
                  className={`px-6 py-2 rounded-lg bg-blue-500 text-white ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                  } ml-auto`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Creating...
                    </span>
                  ) : step === steps.length - 1 ? (
                    'Create'
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 flex justify-center">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    i === step ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InitializationFlow;