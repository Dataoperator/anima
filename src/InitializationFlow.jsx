import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { authManager } from './auth';
import AnimaChat from './components/chat/AnimaChat';
import { motion } from 'framer-motion';

export function InitializationFlow() {
  const { identity } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsInitialization, setNeedsInitialization] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const checkInitialization = async () => {
      if (!identity) {
        console.log("No identity found in InitializationFlow");
        setLoading(false);
        return;
      }

      try {
        console.log("Checking initialization status");
        const actor = authManager.getActor();
        if (!actor) {
          throw new Error("Actor not initialized");
        }

        const principal = identity.getPrincipal();
        const userState = await actor.get_user_state([principal]);
        console.log("User state received:", userState);
        
        if ('NotInitialized' in userState) {
          console.log("User needs initialization");
          setNeedsInitialization(true);
        } else {
          console.log("User already initialized");
          setInitialized(true);
        }
      } catch (err) {
        console.error("Initialization check failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkInitialization();
  }, [identity]);

  const handleCreateAnima = async (name) => {
    try {
      console.log("Creating anima with name:", name);
      setLoading(true);
      const actor = authManager.getActor();
      const result = await actor.create_anima(name);
      if ('Ok' in result) {
        console.log("Anima created successfully");
        setInitialized(true);
        setNeedsInitialization(false);
      } else {
        throw new Error('Failed to initialize anima');
      }
    } catch (err) {
      console.error("Failed to create anima:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (initialized) {
    console.log("Rendering AnimaChat - initialization complete");
    return <AnimaChat />;
  }

  if (needsInitialization) {
    console.log("Showing anima creation form");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-6">Create Your Anima</h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.animaName.value;
            handleCreateAnima(name);
          }}
          className="w-full max-w-md"
        >
          <input
            type="text"
            name="animaName"
            placeholder="Enter a name for your Anima"
            className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            minLength={2}
            maxLength={32}
          />
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Create
          </button>
        </form>
      </div>
    );
  }

  console.log("Unexpected state in InitializationFlow");
  return null;
}