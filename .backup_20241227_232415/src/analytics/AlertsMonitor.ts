export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type AlertCategory = 'System' | 'Security' | 'Performance' | 'User' | 'Network';

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  acknowledged: boolean;
  source: string;
  severity: AlertSeverity;
  category: AlertCategory;
  resolved: boolean;
  resolvedBy?: string;
  metadata?: Record<string, string | number>;
}

export interface AlertFilter {
  type?: 'error' | 'warning' | 'info';
  source?: string;
  since?: number;
  acknowledged?: boolean;
}

export class AlertsMonitor {
  private alerts: Alert[] = [];

  addAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>): Alert {
    const newAlert: Alert = {
      ...alert,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      acknowledged: false,
      resolved: false
    };
    
    this.alerts.push(newAlert);
    return newAlert;
  }

  getAlerts(filters?: AlertFilter): Alert[] {
    if (!filters) return this.alerts;

    let filtered = [...this.alerts];

    if (filters.type) {
      filtered = filtered.filter(a => a.type === filters.type);
    }

    if (filters.source) {
      filtered = filtered.filter(a => a.source === filters.source);
    }

    if (typeof filters.acknowledged === 'boolean') {
      filtered = filtered.filter(a => a.acknowledged === filters.acknowledged);
    }

    if (filters.since !== undefined) {
      filtered = filtered.filter(a => a.timestamp >= filters.since);
    }

    return filtered;
  }

  acknowledgeAlert(id: string): boolean {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  resolveAlert(id: string, resolvedBy: string): boolean {
    const alert = this.alerts.find(a => a.id === id);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedBy = resolvedBy;
      return true;
    }
    return false;
  }

  clearAcknowledged(): void {
    this.alerts = this.alerts.filter(a => !a.acknowledged);
  }

  clearResolved(): void {
    this.alerts = this.alerts.filter(a => !a.resolved);
  }

  clearAll(): void {
    this.alerts = [];
  }
}