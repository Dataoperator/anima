import React, { Component, ErrorInfo } from 'react';
import { ErrorDisplay } from '../error/ErrorDisplay';
import { ErrorTracker } from '@/error/quantum_error';
import { SystemMonitor } from '@/analytics/SystemHealthMonitor';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorTracker?: ErrorTracker;
  systemMonitor?: SystemMonitor;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRecovering: boolean;
}

export class QuantumErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      isRecovering: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Track error
    if (this.props.errorTracker) {
      this.props.errorTracker.recordError({
        context: 'QUANTUM_BOUNDARY',
        error,
        timestamp: Date.now(),
        severity: 'high'
      });
    }

    // Monitor system health
    if (this.props.systemMonitor) {
      this.props.systemMonitor.recordMetric({
        type: 'error_boundary_triggered',
        value: 1,
        context: {
          error: error.message,
          component: errorInfo.componentStack
        }
      });
    }
  }

  handleRecoveryAttempt = async () => {
    this.setState({ isRecovering: true });

    try {
      // Wait for any pending quantum operations to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset error state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRecovering: false
      });

      if (this.props.systemMonitor) {
        this.props.systemMonitor.recordMetric({
          type: 'error_recovery_success',
          value: 1,
          context: {
            timestamp: Date.now()
          }
        });
      }
    } catch (recoveryError) {
      this.setState({
        isRecovering: false,
        error: recoveryError as Error
      });

      if (this.props.errorTracker) {
        this.props.errorTracker.recordError({
          context: 'RECOVERY_FAILED',
          error: recoveryError as Error,
          timestamp: Date.now(),
          severity: 'critical'
        });
      }
    }
  };

  render() {
    const { hasError, error, isRecovering } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (isRecovering) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-black text-cyan-500">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Quantum Recovery in Progress</h2>
              <p className="text-cyan-400">Stabilizing quantum state...</p>
            </div>
          </div>
        );
      }

      if (fallback) {
        return fallback;
      }

      return (
        <ErrorDisplay
          error={error}
          onRetry={this.handleRecoveryAttempt}
          message="A quantum state error occurred"
        />
      );
    }

    return children;
  }
}