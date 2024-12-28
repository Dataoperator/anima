# Admin Dashboard Documentation

## Overview

The admin dashboard provides comprehensive monitoring and management capabilities for the Living NFTs platform. Access is restricted to authorized administrators with appropriate permissions.

## Access Control

### Admin Roles

- **SUPER_ADMIN**: Full access to all dashboard features
- **ADMIN**: Access based on assigned permissions

### Permission Types

1. **Dashboard Permissions**
   - `VIEW_METRICS` - View system metrics
   - `VIEW_ALERTS` - View system alerts

2. **Security Permissions**
   - `VIEW_SECURITY` - View security metrics
   - `MANAGE_SECURITY` - Modify security settings

3. **Network Permissions**
   - `VIEW_NETWORK` - View network statistics
   - `MANAGE_NETWORK` - Modify network settings

4. **User Permissions**
   - `VIEW_USERS` - View user analytics
   - `MANAGE_USERS` - Manage user accounts

5. **System Permissions**
   - `VIEW_SYSTEM` - View system health
   - `MANAGE_SYSTEM` - Modify system settings

## Dashboard Components

### 1. SystemHealth
Monitors overall system health including:
- Resource usage (memory, CPU)
- Cycles consumption and balance
- Performance metrics
- Component status tracking
- Real-time health indicators

### 2. SecurityPanel
Provides security monitoring through:
- Real-time threat detection
- Security event logging
- Active defense monitoring
- Risk assessment visualization
- Security metrics tracking

### 3. NetworkStats
Tracks network performance via:
- Latency monitoring
- Throughput analysis
- Connection tracking
- Error rate visualization
- Network health indicators

### 4. UserAnalytics
Analyzes user behavior including:
- Activity patterns
- Growth metrics
- Retention rates
- Feature usage statistics
- User engagement metrics

### 5. AlertsPanel
Manages system alerts with:
- Real-time alert monitoring
- Severity classification
- Alert filtering and sorting
- Resolution tracking
- Historical alert analysis

## Integration Guide

### Route Protection
Integrate admin route protection:

```typescript
// Wrap admin routes with AdminRoute component
<AdminRoute requiredPermissions={['VIEW_METRICS']}>
  <DashboardComponent />
</AdminRoute>
```

### Permission Management

```typescript
// Check specific permission
const canViewMetrics = await adminAuth.hasPermission(
  principal, 
  'VIEW_METRICS'
);

// Validate multiple permissions
const hasAccess = await adminAuth.validateAccess(
  principal, 
  ['VIEW_METRICS', 'VIEW_ALERTS']
);
```

## Monitoring Configuration

### System Health Monitoring
```typescript
// Record system metrics
await systemHealthMonitor.recordMetrics({
  timestamp: new Date(),
  memory: {
    total: BigInt(4 * 1024 * 1024 * 1024), // 4GB
    used: currentMemoryUsage,
    heap: heapSize,
    stable: stableMemorySize
  },
  cycles: {
    balance: currentBalance,
    consumed: cyclesConsumed,
    refunded: cyclesRefunded
  },
  performance: {
    responseTime: avgResponseTime,
    throughput: requestsPerSecond,
    errorRate: errorPercentage,
    successRate: successPercentage
  }
});
```

### Alert Configuration
```typescript
// Configure critical alert
await alertsMonitor.addAlert({
  severity: 'Critical',
  category: 'System',
  message: 'High memory usage detected',
  metadata: {
    usagePercentage: 95,
    threshold: 90
  }
});
```

## Best Practices

1. **Performance**
   - Regular metric cleanup
   - Efficient data structures
   - Optimized update intervals

2. **Security**
   - Regular permission audits
   - Secure credential storage
   - Activity logging

3. **Maintenance**
   - Regular backups
   - Update documentation
   - Monitor system impact

## Deployment

### Initial Setup
```bash
# Deploy admin dashboard
dfx deploy admin_dashboard

# Add initial super admin
dfx canister call admin_dashboard addAdmin '(principal, "SUPER_ADMIN")'
```

### Updates
```bash
# Update permissions
dfx canister call admin_dashboard updatePermissions '(principal, permissions)'

# Update monitoring config
dfx canister call admin_dashboard updateConfig '(config)'
```

## Error Handling

```typescript
try {
  await adminAuth.validateAccess(principal, permissions);
} catch (error) {
  await alertsMonitor.addAlert({
    severity: 'Warning',
    category: 'Security',
    message: 'Access validation failed',
    metadata: { error: error.message }
  });
}
```

## Support & Maintenance

1. **Regular Updates**
   - Monitor system metrics
   - Update thresholds
   - Refine alert rules

2. **Troubleshooting**
   - Check logs
   - Verify permissions
   - Monitor resource usage

3. **Documentation**
   - Keep updated
   - Document changes
   - Track configurations