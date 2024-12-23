import React, { useEffect, useState, Suspense } from 'react';
import { Principal } from '@dfinity/principal';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { SafeSparkles } from './components/Icons';

// Lazy load components
const ImmersiveAnimaUI = React.lazy(() => import('./components/ImmersiveAnimaUI'));
const InitializationFlow = React.lazy(() => import('./InitializationFlow'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-purple-500">
    <motion.div
      className="relative"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-32 h-32">
        <div className="absolute w-full h-full border-8 border-white border-t-transparent rounded-full animate-spin" />
        <div className="absolute w-full h-full border-8 border-blue-300 border-t-transparent rounded-full animate-ping" />
      </div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <SafeSparkles className="w-12 h-12 text-white" />
      </motion.div>
    </motion.div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isInitialized, login } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-500">
          {!isAuthenticated ? (
            <LoginScreen onLogin={login} />
          ) : !isInitialized ? (
            <InitializationFlow />
          ) : (
            <ImmersiveAnimaUI />
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

const LoginScreen = ({ onLogin }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-8 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
    >
      <div className="flex justify-center mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <SafeSparkles className="w-16 h-16 text-blue-500" />
        </motion.div>
      </div>
      <h1 className="text-3xl font-bold text-center mb-2">Welcome to Anima</h1>
      <p className="text-gray-600 text-center mb-8">
        Your personal AI companion awaits
      </p>
      <motion.button
        onClick={onLogin}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Login with Internet Identity
      </motion.button>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        Secure authentication powered by Internet Computer
      </div>
    </motion.div>
    
    {/* Ambient background animation */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default App;