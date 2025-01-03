import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/components/App';
import { AuthProvider } from '@/contexts/auth-context';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import './styles.css';

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-black text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p className="mt-4">Loading ANIMA...</p>
    </div>
  </div>
);

// Error component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-screen bg-black text-white">
    <div className="text-center max-w-lg p-6">
      <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
      <p className="text-red-400 mb-4">{error.message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Reload Page
      </button>
    </div>
  </div>
);

// Initialize IC
const initIC = async () => {
  try {
    console.log('Initializing Internet Computer connection...');
    await import('./ic-init');
    console.log('IC initialization complete');
  } catch (error) {
    console.error('Failed to initialize IC:', error);
    throw error;
  }
};

// Initialize the app
const initApp = async () => {
  try {
    await initIC();
    
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found');

    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <AnimationProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </AnimationProvider>
          </Suspense>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    document.body.innerHTML = `
      <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:black;color:white;">
        <div style="text-align:center;padding:20px;">
          <h1 style="margin-bottom:16px;">Failed to initialize ANIMA</h1>
          <p style="color:#ff6b6b;margin-bottom:16px;">${error instanceof Error ? error.message : 'Unknown error'}</p>
          <button onclick="window.location.reload()" 
                  style="padding:8px 16px;background:#2563eb;border-radius:4px;cursor:pointer;">
            Retry
          </button>
        </div>
      </div>
    `;
  }
};

// Start the app
initApp();