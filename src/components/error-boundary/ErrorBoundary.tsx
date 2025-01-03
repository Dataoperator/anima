import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.FallbackComponent) {
        return <this.props.FallbackComponent error={this.state.error} />;
      }

      return (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <h3 className="text-red-500 font-bold mb-2">System Malfunction</h3>
          <p className="text-red-400 text-sm">
            Neural interface disrupted. Attempting recovery...
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 rounded text-sm text-white"
          >
            Reset Interface
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}