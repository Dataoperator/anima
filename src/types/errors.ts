export class AnimalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnimalError';
  }
}

export class PatternRecognitionError extends AnimalError {
  constructor(
    message: string,
    public readonly patternType?: string,
    public readonly context?: any
  ) {
    super(`Pattern Recognition Error: ${message}`);
    this.name = 'PatternRecognitionError';
  }
}

export class QuantumStateError extends AnimalError {
  constructor(
    message: string,
    public readonly stateId?: string,
    public readonly metrics?: any
  ) {
    super(`Quantum State Error: ${message}`);
    this.name = 'QuantumStateError';
  }
}

export class ConsciousnessError extends AnimalError {
  constructor(
    message: string,
    public readonly component?: string,
    public readonly state?: any
  ) {
    super(`Consciousness Error: ${message}`);
    this.name = 'ConsciousnessError';
  }
}

export class EvolutionError extends AnimalError {
  constructor(
    message: string,
    public readonly stage?: string,
    public readonly metrics?: any
  ) {
    super(`Evolution Error: ${message}`);
    this.name = 'EvolutionError';
  }
}

export class TaskExecutionError extends AnimalError {
  constructor(
    message: string,
    public readonly taskId?: string,
    public readonly execution?: any
  ) {
    super(`Task Execution Error: ${message}`);
    this.name = 'TaskExecutionError';
  }
}

// Error recovery utilities
export interface ErrorRecoveryStrategy {
  canHandle(error: Error): boolean;
  recover(error: Error): Promise<void>;
  rollback(error: Error): Promise<void>;
}

export interface ErrorContext {
  timestamp: number;
  component: string;
  operation: string;
  input?: any;
  state?: any;
  recoveryAttempts: number;
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorLog {
  error: Error;
  context: ErrorContext;
  severity: ErrorSeverity;
  recovered: boolean;
  recoveryStrategy?: string;
  timestamp: number;
}