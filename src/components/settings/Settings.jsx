import React from 'react';
import { useAuth } from '../../AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export const Settings = () => {
  const { authState } = useAuth();
  const [openAIKey, setOpenAIKey] = React.useState('');
  const [isConfiguring, setIsConfiguring] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const handleConfigureOpenAI = async (e) => {
    e.preventDefault();
    if (!openAIKey.trim() || isConfiguring) return;

    setIsConfiguring(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authState.actor.set_openai_config(openAIKey.trim());
      if ('Ok' in response) {
        setSuccess(true);
        setOpenAIKey('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to configure OpenAI');
      }
    } catch (error) {
      console.error('Settings error:', error);
      setError('Failed to configure OpenAI API key. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsConfiguring(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>

      <form onSubmit={handleConfigureOpenAI}>
        <div className="space-y-4">
          <div>
            <label htmlFor="openai-key" className="block text-sm font-medium text-gray-300">
              OpenAI API Key
            </label>
            <input
              id="openai-key"
              type="password"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
              placeholder="sk-..."
              disabled={isConfiguring}
            />
          </div>

          <button
            type="submit"
            disabled={isConfiguring || !openAIKey.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConfiguring ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Configure OpenAI'}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-md bg-red-900/50 text-red-200 text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-md bg-green-900/50 text-green-200 text-sm"
          >
            Successfully configured OpenAI API key!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <h4 className="text-sm font-medium text-gray-300 mb-2">About Your Anima</h4>
        <div className="bg-gray-700 rounded-md p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Created</span>
            <span className="text-gray-200">
              {new Date(Number(authState?.creationTime || 0)).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Name</span>
            <span className="text-gray-200">{authState?.animaName || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">OpenAI Status</span>
            <span className={`${authState?.isOpenAIConfigured ? 'text-green-400' : 'text-yellow-400'}`}>
              {authState?.isOpenAIConfigured ? 'Configured' : 'Not Configured'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;