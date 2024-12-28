import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MintAnima = () => {
  const { actor } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMint = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Minting anima with name:', name);
      const result = await actor.mint_anima(name);
      console.log('Mint result:', result);

      // Result will be in the form { Ok: tokenId } or { Err: errorMessage }
      if ('Ok' in result) {
        const tokenId = result.Ok;
        console.log('Successfully minted anima with token ID:', tokenId);
        navigate(`/anima/${tokenId}`);
      } else if ('Err' in result) {
        switch (result.Err) {
          case 'AlreadyInitialized':
            setError('You already have a Living NFT');
            break;
          default:
            setError(`Failed to mint: ${result.Err}`);
        }
      }
    } catch (err) {
      console.error('Mint error:', err);
      setError(err.message || 'Failed to mint Living NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const validateName = (value) => {
    // Add name validation rules here
    return value.length >= 2 && value.length <= 50;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20 
              }}
              className="mb-8 text-center"
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
                Create Your Living NFT
              </h1>
              <p className="text-gray-300 text-lg">
                Breathe life into your digital companion
              </p>
            </motion.div>

            <form onSubmit={handleMint} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  Name Your Companion
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="Enter a name..."
                  required
                  minLength={2}
                  maxLength={50}
                />
                <p className="mt-1 text-sm text-gray-400">
                  Name must be between 2 and 50 characters
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !validateName(name)}
                className={`w-full py-4 rounded-lg text-lg font-semibold text-white 
                  ${(!validateName(name) || isLoading)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600'
                  } transition-all duration-200 ease-in-out transform`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-2"
                    />
                    Creating...
                  </div>
                ) : (
                  'Mint Living NFT'
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-gray-300 font-semibold mb-4">What You'll Get:</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: '🧠', text: 'Unique AI-Driven Personality' },
                  { icon: '🌱', text: 'Evolves Through Interaction' },
                  { icon: '💫', text: 'Permanent On-Chain Memory' },
                  { icon: '🎮', text: 'Interactive Experience' }
                ].map(({ icon, text }) => (
                  <motion.div
                    key={text}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 text-gray-300"
                  >
                    <span className="text-2xl">{icon}</span>
                    <span>{text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MintAnima;