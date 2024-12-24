import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/20 rounded-lg">
          <h2 className="text-lg font-semibold text-red-200 mb-2">Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reload App
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-red-200 text-sm">
              <summary>Error Details</summary>
              <pre className="mt-2 p-2 bg-red-900/30 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Add default export
export default ErrorBoundary;