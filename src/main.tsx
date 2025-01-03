import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Initialize error tracking
const initErrorTracking = () => {
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    console.error('Global error:', { msg, url, lineNo, columnNo, error });
    return false;
  };

  window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  };
};

// Lazy load app components
const App = lazy(() => import('./components/App'));
const ErrorBoundary = lazy(() => import('./components/error-boundary/ErrorBoundary').then(m => ({ 
  default: m.ErrorBoundary 
})));
const LoadingFallback = lazy(() => import('./components/ui/LoadingFallback').then(m => ({ 
  default: m.LoadingFallback 
})));

// Root error fallback
const RootErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="max-w-md text-center p-8">
      <h1 className="text-xl font-bold mb-4">Neural Interface Error</h1>
      <p className="text-red-400 mb-6">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Reinitialize
      </button>
    </div>
  </div>
);

// Initialize Internet Computer connection
const initIC = async () => {
  try {
    console.log('Initializing Internet Computer connection...');
    await import('./ic-init');
    console.log('IC initialization complete');
  } catch (error) {
    console.error('IC initialization failed:', error);
    throw new Error('Failed to establish quantum connection.');
  }
};

// Initialize app
const initApp = async () => {
  try {
    // Initialize error tracking
    initErrorTracking();

    // Wait for IC initialization
    await initIC();
    
    // Get root element
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Neural interface anchor not found');
    }

    // Create root and render app
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={RootErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('App initialization failed:', error);
    
    // Render error state
    document.body.innerHTML = `
      <div class="min-h-screen bg-black text-white flex items-center justify-center">
        <div class="max-w-md text-center p-8">
          <h1 class="text-xl font-bold mb-4">Critical System Error</h1>
          <p class="text-red-400 mb-6">${error instanceof Error ? error.message : 'Unknown error'}</p>
          <button 
            onclick="window.location.reload()" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            Reset System
          </button>
        </div>
      </div>
    `;
  }
};

// Initialize key dependencies before starting app
Promise.all([
  // Preload critical components
  import('./components/App'),
  import('./components/error-boundary/ErrorBoundary'),
  import('./components/ui/LoadingFallback'),
  // Preload key features
  import('framer-motion'),
  import('react-router-dom')
]).then(() => {
  // Start app
  initApp().catch(console.error);
}).catch(error => {
  console.error('Failed to load critical dependencies:', error);
  document.body.innerHTML = `
    <div class="min-h-screen bg-black text-white flex items-center justify-center">
      <div class="max-w-md text-center p-8">
        <h1 class="text-xl font-bold mb-4">Critical Loading Error</h1>
        <p class="text-red-400 mb-6">Failed to load system components</p>
        <button 
          onclick="window.location.reload()" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          Retry
        </button>
      </div>
    </div>
  `;
});