import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Actor } from '@dfinity/agent';
import { idlFactory } from '@/declarations/anima/anima.did.js';
import { canisterEnv } from '@/config/canisterEnv';

export const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading, identity, actor, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAnima, setHasAnima] = useState(false);

  useEffect(() => {
    const checkAnimaStatus = async () => {
      if (!actor) return;
      
      try {
        const userState = await actor.get_user_state([]);
        const initialized = 'Initialized' in userState;
        setHasAnima(initialized);
        
        if (!initialized && location.pathname !== '/mint') {
          navigate('/mint');
        } else if (initialized && location.pathname === '/mint') {
          const anima = await actor.get_owned_animas();
          if (anima.length > 0) {
            navigate(`/anima/${anima[0]}`);
          }
        }
      } catch (error) {
        console.error('Failed to check anima status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    const initializeActor = async () => {
      if (identity && !actor) {
        try {
          const newActor = await Actor.createActor(idlFactory, {
            agent: identity.getAgent(),
            canisterId: canisterEnv.anima
          });
          setActor(newActor);
        } catch (error) {
          console.error('Failed to initialize actor:', error);
        }
      }
    };

    if (isAuthenticated && identity) {
      initializeActor();
      checkAnimaStatus();
    } else if (!loading && !isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, identity, actor, location.pathname, navigate, loading]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      if (error.message !== 'UserInterrupt') {
        console.error('Login failed:', error);
      }
    }
  };

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-white/90">Preparing your experience...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Welcome to Anima
          </h2>
          <p className="text-white/80 mb-8 text-center">
            Connect with Internet Identity to begin your journey
          </p>
          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Connect with Internet Identity</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
};