import React, { useState } from 'react';
import { useAuth } from '../../AuthProvider';

const OpenAIConfig = () => {
  const { actor } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await actor.set_openai_config(apiKey);
      if ('Ok' in result) {
        setSuccess(true);
        setApiKey('');
      } else {
        throw new Error('Failed to set OpenAI configuration');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">OpenAI Configuration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-sm">
            OpenAI configuration updated successfully!
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
};

export default OpenAIConfig;