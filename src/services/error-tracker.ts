import { Principal } from '@dfinity/principal';

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ErrorCategory {
  PAYMENT = 'PAYMENT',
  LEDGER = 'LEDGER',
  QUANTUM = 'QUANTUM',
  AUTHENTICATION = 'AUTH',
  NETWORK = 'NETWORK',
  STATE = 'STATE',
  CONTRACT = 'CONTRACT'
}

interface ErrorContext {
  timestamp: number;
  principal?: Principal;
  transactionId?: string;
  quantumState?: string;
  ledgerEndpoint?: string;
  componentStack?: string;
  extraData?: Record<string, any>;
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Map<string, Array<{error: Error, context: ErrorContext}>> = new Map();
  private errorCallbacks: Set<(category: ErrorCategory, error: Error, context: ErrorContext) => void> = new Set();

  private constructor() {}

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  trackError(
    category: ErrorCategory,
    error: Error,
    severity: ErrorSeverity,
    context: Partial<ErrorContext> = {}
  ): string {
    const errorId = this.generateErrorId();
    const fullContext: ErrorContext = {
      timestamp: Date.now(),
      ...context
    };

    // Store error with context
    if (!this.errors.has(category)) {
      this.errors.set(category, []);
    }
    this.errors.get(category)!.push({ error, context: fullContext });

    // Log detailed error information
    console.error(`[${severity}] ${category} Error (${errorId}):`, {
      message: error.message,
      stack: error.stack,
      context: fullContext
    });

    // Notify error subscribers
    this.notifyErrorCallbacks(category, error, fullContext);

    // Special handling for critical errors
    if (severity === ErrorSeverity.CRITICAL) {
      this.handleCriticalError(category, error, fullContext);
    }

    return errorId;
  }

  async getErrorReport(category?: ErrorCategory): Promise<string> {
    const errors = category ? 
      this.errors.get(category) || [] :
      Array.from(this.errors.values()).flat();

    return JSON.stringify(errors.map(({ error, context }) => ({
      timestamp: new Date(context.timestamp).toISOString(),
      category,
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        principal: context.principal?.toString(),
      }
    })), null, 2);
  }

  subscribeToErrors(
    callback: (category: ErrorCategory, error: Error, context: ErrorContext) => void
  ): () => void {
    this.errorCallbacks.add(callback);
    return () => this.errorCallbacks.delete(callback);
  }

  clearErrors(category?: ErrorCategory): void {
    if (category) {
      this.errors.delete(category);
    } else {
      this.errors.clear();
    }
  }

  private generateErrorId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private notifyErrorCallbacks(
    category: ErrorCategory,
    error: Error,
    context: ErrorContext
  ): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(category, error, context);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    });
  }

  private handleCriticalError(
    category: ErrorCategory,
    error: Error,
    context: ErrorContext
  ): void {
    // Log to permanent storage
    this.logToPermanentStorage({
      category,
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });

    // Attempt recovery actions based on category
    switch (category) {
      case ErrorCategory.PAYMENT:
        this.recoverPaymentState(error, context);
        break;
      case ErrorCategory.QUANTUM:
        this.recoverQuantumState(error, context);
        break;
      case ErrorCategory.LEDGER:
        this.recoverLedgerConnection(error, context);
        break;
      // Add other category-specific recovery actions
    }
  }

  private async logToPermanentStorage(errorData: any): Promise<void> {
    try {
      // Implement permanent storage logging
      // This could be to a canister, local storage, or external service
      console.warn('Critical error logged:', errorData);
    } catch (error) {
      console.error('Failed to log to permanent storage:', error);
    }
  }

  private async recoverPaymentState(error: Error, context: ErrorContext): Promise<void> {
    try {
      // Implement payment state recovery logic
      // This could include:
      // 1. Verifying transaction status
      // 2. Rolling back incomplete transactions
      // 3. Notifying admin system
      console.warn('Attempting payment state recovery:', { error, context });
    } catch (recoveryError) {
      console.error('Failed to recover payment state:', recoveryError);
    }
  }

  private async recoverQuantumState(error: Error, context: ErrorContext): Promise<void> {
    try {
      // Implement quantum state recovery
      // This could include:
      // 1. State verification
      // 2. Coherence check
      // 3. State reset if necessary
      console.warn('Attempting quantum state recovery:', { error, context });
    } catch (recoveryError) {
      console.error('Failed to recover quantum state:', recoveryError);
    }
  }

  private async recoverLedgerConnection(error: Error, context: ErrorContext): Promise<void> {
    try {
      // Implement ledger connection recovery
      // This could include:
      // 1. Connection retry with backoff
      // 2. Endpoint failover
      // 3. State verification
      console.warn('Attempting ledger connection recovery:', { error, context });
    } catch (recoveryError) {
      console.error('Failed to recover ledger connection:', recoveryError);
    }
  }
}