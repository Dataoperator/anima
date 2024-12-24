import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../AuthProvider';

const OpenAIConfig = () => {
  const { authState } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!authState.actor) throw new Error('Not connected');
      
      await authState.actor.configure_openai(apiKey.trim(), model);
      setSuccess(true);
      setApiKey(''); // Clear for security
    } catch (err) {
      setError(err.message || 'Failed to configure OpenAI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">OpenAI Settings</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="sk-..."
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
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

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded bg-green-900/30 text-green-200 text-sm"
          >
            OpenAI configuration updated successfully!
          </motion.div>
        )}

        <button
          type="submit"
          disabled={!apiKey.trim() || isLoading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Configuration'}
        </button>
      </form>

      <div className="mt-4 p-4 rounded-md bg-blue-900/30 text-blue-200 text-sm">
        <h4 className="font-medium mb-2">About OpenAI Integration</h4>
        <p>
          Your API key is securely stored in the canister and never exposed.
          The key is used only for interactions with your Anima.
        </p>
      </div>
    </div>
  );
};

export default OpenAIConfig;