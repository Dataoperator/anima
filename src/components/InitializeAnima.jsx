import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthProvider';

const InitializeAnima = () => {
  const { initialize } = useAuth();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await initialize(name.trim());
    } catch (err) {
      setError(err.message || 'Failed to create your Anima');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Create Your Anima</h2>
        
        <p className="text-gray-300 mb-6">
          Your Anima will be a unique AI companion that learns and grows with you.
          Choose a name to begin your journey together.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name your Anima
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a name..."
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded bg-red-900/30 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={!name.trim() || isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Creating...
              </span>
            ) : (
              'Create Anima'
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default InitializeAnima;