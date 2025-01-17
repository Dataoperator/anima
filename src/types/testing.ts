export interface TestResult {
  passed: boolean;
  metrics: {
    duration: number;
    coverage: number;
    assertions: number;
    failures: number;
  };
  errors: TestError[];
  traces: TestTrace[];
}

export interface TestError {
  message: string;
  stack?: string;
  componentName?: string;
  testCase?: string;
  expectedValue?: any;
  actualValue?: any;
}

export interface TestTrace {
  timestamp: number;
  component: string;
  action: string;
  params?: Record<string, any>;
  result?: any;
}

export interface TestContext {
  quantum: {
    coherenceLevel: number;
    stabilityIndex: number;
    dimensionality: number;
  };
  emotional: {
    dominantEmotion: string;
    intensity: number;
    stability: number;
  };
  skills: {
    available: string[];
    levels: Record<string, number>;
    masteryThresholds: Record<string, number>;
  };
}