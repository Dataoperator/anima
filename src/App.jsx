import React from 'react';
import { AuthProvider } from './AuthProvider';
import { InitializationFlow } from './InitializationFlow';
import AnimaChat from './components/chat/AnimaChat';
import { useAuth } from './AuthProvider';

const LoginScreen = ({ onLogin }) => {
  console.log("Rendering LoginScreen...");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Welcome to Anima</h1>
      <button
        onClick={() => {
          console.log("Login button clicked");
          onLogin();
        }}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
      >
        Login with Internet Identity
      </button>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, identity, login } = useAuth();
  console.log("AppContent - Auth state:", { isAuthenticated, hasIdentity: !!identity });

  if (!isAuthenticated || !identity) {
    console.log("User not authenticated, showing login screen");
    return <LoginScreen onLogin={login} />;
  }

  console.log("User authenticated, proceeding to initialization flow");
  return <InitializationFlow />;
};

const App = () => {
  console.log("Rendering App component");
  return (
    <AuthProvider>
      <div className="h-screen bg-gray-50">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;