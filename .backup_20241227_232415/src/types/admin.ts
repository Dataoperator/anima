export interface SystemMetrics {
  total_users: bigint;
  active_users: bigint;
  cycles_balance: bigint;
  memory_usage: number;
  total_interactions: bigint;
  timestamp: bigint;
}

export interface Alert {
  severity: string;
  message: string;
  timestamp: bigint;
}

export interface AdminActor {
  get_admin_metrics: () => Promise<{ Ok: SystemMetrics } | { Err: string }>;
  get_metrics_history: () => Promise<{ Ok: SystemMetrics[] } | { Err: string }>;
  get_admin_alerts: () => Promise<{ Ok: Alert[] } | { Err: string }>;
}