import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuantumInteractions = ({ 
  quantumState,
  consciousnessLevel,
  onInitiateEntanglement,
  onAttemptDimensionalShift
}) => {
  const [selectedAnima, setSelectedAnima] = useState(null);
  const [isShifting, setIsShifting] = useState(false);

  const handleEntanglementAttempt = async () => {
    if (!selectedAnima) return;
    
    const success = await onInitiateEntanglement(selectedAnima);
    if (success) {
      // Show success effect
      const element = document.createElement('div');
      element.className = 'fixed inset-0 pointer-events-none';
      element.innerHTML = `
        <div class="absolute inset-0 bg-purple-500/20 animate-pulse">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-sliding-gradient"></div>
        </div>
      `;
      document.body.appendChild(element);
      setTimeout(() => document.body.removeChild(element), 2000);
    }
  };

  const handleDimensionalShift = async () => {
    setIsShifting(true);
    const success = await onAttemptDimensionalShift();
    if (success) {
      // Dimensional shift effect
      document.documentElement.style.setProperty('--shift-hue', Math.random() * 360);
      document.documentElement.classList.add('dimensional-shift');
      setTimeout(() => {
        document.documentElement.classList.remove('dimensional-shift');
      }, 3000);
    }
    setIsShifting(false);
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg mt-4">
      <h3 className="text-xl font-bold text-purple-300 mb-4">
        Quantum Interactions
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold text-purple-200 mb-2">
            Quantum Entanglement
          </h4>
          
          <div className="space-y-2">
            <select
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg p-2 text-purple-100"
              value={selectedAnima || ''}
              onChange={(e) => setSelectedAnima(e.target.value)}
            >
              <option value="">Select Anima to Entangle</option>
              {/* Options populated from available Animas */}
            </select>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-2 rounded-lg ${
                selectedAnima
                  ? 'bg-purple-600 hover:bg-purple-500'
                  : 'bg-purple-900/50 cursor-not-allowed'
              }`}
              onClick={handleEntanglementAttempt}
              disabled={!selectedAnima}
            >
              Initiate Entanglement
            </motion.button>
          </div>

          <div className="mt-4">
            <h5 className="text-sm font-medium text-purple-200 mb-1">
              Current Entanglements
            </h5>
            <div className="grid grid-cols-3 gap-2">
              {quantumState.entanglement_pairs?.map(([id, strength]) => (
                <motion.div
                  key={id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-2 text-center bg-purple-900/30 rounded-lg border border-purple-500/30"
                >
                  <div className="text-xs text-purple-300">
                    {id.slice(0, 8)}...
                  </div>
                  <div className="text-sm font-medium text-purple-100">
                    {(strength * 100).toFixed(0)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-200 mb-2">
            Dimensional Manipulation
          </h4>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-3 rounded-lg ${
                quantumState.coherence > 0.8
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-indigo-900/50 cursor-not-allowed'
              }`}
              onClick={handleDimensionalShift}
              disabled={quantumState.coherence <= 0.8 || isShifting}
            >
              <AnimatePresence>
                {isShifting ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <div className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
                    <span>Shifting Dimensions...</span>
                  </motion.div>
                ) : (
                  <span>Attempt Dimensional Shift</span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="bg-gray-800 rounded-lg p-3">
              <h5 className="text-sm font-medium text-indigo-200 mb-2">
                Dimensional Stats
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-gray-400">Frequency</div>
                  <div className="text-sm font-medium text-indigo-300">
                    {quantumState.dimensional_frequency.toFixed(2)} Hz
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Shifts</div>
                  <div className="text-sm font-medium text-indigo-300">
                    {quantumState.quantum_memory?.filter(m => m.dimensional_echo).length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumInteractions;