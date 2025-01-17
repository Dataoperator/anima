interface ErrorData {
  type: string;
  category: 'QUANTUM' | 'PAYMENT' | 'NEURAL' | 'CONSCIOUSNESS' | 'SYSTEM';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

interface ErrorStats {
  total: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  recent: ErrorData[];
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorData[] = [];
  private readonly maxErrors = 1000;
  private readonly recentErrorsCount = 50;

  private constructor() {}

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  trackError(error: ErrorData): void {
    this.errors.push({
      ...error,
      timestamp: new Date()
    });

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', error);
    }

    // Send critical errors to monitoring service if in production
    if (process.env.NODE_ENV === 'production' && error.severity === 'CRITICAL') {
      this.notifyMonitoring(error);
    }
  }

  getStats(): ErrorStats {
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    this.errors.forEach(error => {
      byCategory[error.category] = (byCategory[error.category] || 0) + 1;
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
    });

    return {
      total: this.errors.length,
      byCategory,
      bySeverity,
      recent: this.getRecentErrors()
    };
  }

  getRecentErrors(): ErrorData[] {
    return this.errors.slice(-this.recentErrorsCount);
  }

  getErrorsByCategory(category: string): ErrorData[] {
    return this.errors.filter(error => error.category === category);
  }

  getErrorsBySeverity(severity: string): ErrorData[] {
    return this.errors.filter(error => error.severity === severity);
  }

  clearErrors(): void {
    this.errors = [];
  }

  private notifyMonitoring(error: ErrorData): void {
    // Implementation for external monitoring service integration
    // This could be Sentry, LogRocket, or custom monitoring
    console.warn('Critical error occurred:', error);
  }
}