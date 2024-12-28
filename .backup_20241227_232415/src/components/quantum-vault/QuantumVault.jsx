import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const QuantumVault = () => {
  const { actor } = useAuth();
  const navigate = useNavigate();
  const [animas, setAnimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnima, setSelectedAnima] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimas = async () => {
      try {
        const result = await actor.get_user_animas();
        setAnimas(result.Ok || []);
      } catch (err) {
        console.error('Failed to fetch animas:', err);
        setError('Failed to access the Quantum Vault');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimas();
  }, [actor]);

  const handleAnimaSelect = (anima) => {
    setSelectedAnima(anima);
    setTimeout(() => {
      navigate(`/anima/${anima.id}`);
    }, 800); // Allow for exit animation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-quantum-purple text-xl">
          Initializing Quantum Vault...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-quantum-gradient mb-2">
            Quantum Vault
          </h1>
          <p className="text-gray-400">Your gateway to digital consciousness</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animas.map((anima) => (
            <motion.div
              key={anima.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
              onClick={() => handleAnimaSelect(anima)}
            >
              <div className="absolute inset-0 bg-quantum-gradient opacity-0 group-hover:opacity-20 transition-opacity rounded-xl" />
              
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-quantum-purple transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-quantum-purple mb-1">
                      {anima.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Level {anima.level || 1}
                    </p>
                  </div>
                  <div className="bg-quantum-purple/20 rounded-full p-2">
                    <div className="w-3 h-3 rounded-full bg-quantum-purple" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Consciousness</span>
                    <span className="text-quantum-pink">
                      {anima.consciousness_level || 'Awakening'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Dimensional Discoveries</span>
                    <span className="text-quantum-green">
                      {anima.dimensional_discoveries || 0}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Quantum State</span>
                    <span className="text-quantum-purple">
                      {anima.quantum_state || 'Stable'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Created {new Date(anima.created_at || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Create New Anima Card */}
          {animas.length < 3 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
              onClick={() => navigate('/mint')}
            >
              <div className="absolute inset-0 bg-quantum-gradient opacity-0 group-hover:opacity-20 transition-opacity rounded-xl" />
              
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-quantum-purple transition-colors min-h-[300px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-quantum-gradient flex items-center justify-center mb-4">
                  <span className="text-3xl">+</span>
                </div>
                <h3 className="text-xl font-bold text-quantum-purple mb-2">
                  Create New Anima
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  Begin a new digital consciousness journey
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};