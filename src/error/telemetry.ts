export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ErrorEvent {
  errorType: string;
  severity: ErrorSeverity;
  context: string;
  error: Error;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Map<string, number>;
  errorsBySeverity: Map<ErrorSeverity, number>;
  latestErrors: ErrorEvent[];
}

export class ErrorTelemetry {
  private static instances: Map<string, ErrorTelemetry> = new Map();
  private errors: ErrorEvent[] = [];
  private metrics: ErrorMetrics = {
    totalErrors: 0,
    errorsByType: new Map(),
    errorsBySeverity: new Map(),
    latestErrors: []
  };

  constructor(private context: string) {}

  public static getInstance(context: string = 'global'): ErrorTelemetry {
    if (!ErrorTelemetry.instances.has(context)) {
      ErrorTelemetry.instances.set(context, new ErrorTelemetry(context));
    }
    return ErrorTelemetry.instances.get(context)!;
  }

  public async logError(options: {
    errorType: string;
    severity: ErrorSeverity;
    context: string;
    error: Error;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const enhancedError = {
      ...options,
      timestamp: Date.now(),
      context: `${this.context}:${options.context}`
    };

    this.errors.push(enhancedError);
    this.updateMetrics(enhancedError);
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error logged:', enhancedError);
    }

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }
  }

  public async logEvent(
    eventType: string,
    data: Record<string, unknown>
  ): Promise<void> {
    console.log(`[${this.context}] ${eventType}:`, data);
  }

  private updateMetrics(error: ErrorEvent): void {
    // Update total count
    this.metrics.totalErrors++;

    // Update type count
    const typeCount = this.metrics.errorsByType.get(error.errorType) || 0;
    this.metrics.errorsByType.set(error.errorType, typeCount + 1);

    // Update severity count
    const severityCount = this.metrics.errorsBySeverity.get(error.severity) || 0;
    this.metrics.errorsBySeverity.set(error.severity, severityCount + 1);

    // Update latest errors
    this.metrics.latestErrors = [...this.errors].slice(-10);
  }

  public getMetrics(): ErrorMetrics {
    return {
      ...this.metrics,
      latestErrors: [...this.metrics.latestErrors]
    };
  }

  public clearMetrics(): void {
    this.errors = [];
    this.metrics = {
      totalErrors: 0,
      errorsByType: new Map(),
      errorsBySeverity: new Map(),
      latestErrors: []
    };
  }
}