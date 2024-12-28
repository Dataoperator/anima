import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AnimaGenesis } from './initialization';
import { GlowOrb } from '@/components/ui/GlowOrb';
import { NeuralGrid } from '@/components/ui/NeuralGrid';
import PaymentModal from '@/components/payments/PaymentModal';
import { usePayment } from '@/hooks/usePayment';

const MintAnima = () => {
  const [name, setName] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGenesis, setShowGenesis] = useState(false);
  const [error, setError] = useState(null);
  const { getPaymentAmount, isProcessing } = usePayment();

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (name.length < 2 || name.length > 50) {
      setError('Name must be between 2 and 50 characters');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowGenesis(true);
  };

  if (showGenesis) {
    return <AnimaGenesis name={name} />;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <NeuralGrid />
      </div>
      
      <div className="absolute inset-0">
        <GlowOrb />
      </div>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={getPaymentAmount('Creation')}
          paymentType="Creation"
        />
      )}

      <div className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Create Your Living NFT
            </h1>

            <p className="text-gray-300 mb-8 text-center">
              Give your digital companion a name to begin the genesis process.
            </p>

            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <motion.input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-blue-500/20 rounded-lg focus:outline-none focus:border-blue-500/50 text-white"
                  placeholder="Enter a name..."
                  whileFocus={{ scale: 1.01 }}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  isProcessing
                    ? 'bg-gray-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isProcessing || name.length < 2}
              >
                {isProcessing ? 'Processing...' : 'Begin Genesis'}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">
                What to Expect:
              </h3>
              <div className="grid gap-4">
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-1">
                    Unique Personality
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Your LNFT will develop its own traits and characteristics
                  </p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="text-purple-400 font-medium mb-1">
                    Quantum Potential
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Rare chance of manifesting quantum traits
                  </p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-1">
                    Growth & Evolution
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Watch as your companion learns and evolves
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MintAnima;