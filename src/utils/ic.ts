import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

declare global {
  interface Window {
    ic: {
      agent: HttpAgent | null;
      HttpAgent: any;
      canister: {
        call: (
          canisterId: string | Principal,
          methodName: string,
          args?: Record<string, unknown>
        ) => Promise<any>;
      };
    };
  }
}

export type AlertType = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  type: AlertType;
  status: AlertStatus;
  message: string;
  timestamp: bigint;
  metadata?: Record<string, unknown>;
}

export async function getSystemAlerts(animaId: Principal): Promise<Alert[]> {
  try {
    if (!window.ic?.canister) {
      throw new Error('IC interface not initialized');
    }

    const response = await window.ic.canister.call(
      animaId,
      'get_system_alerts'
    );

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch system alerts:', error);
    return [];
  }
}

export async function handleAlert(
  alertId: string,
  action: 'ACKNOWLEDGE' | 'RESOLVE'
): Promise<boolean> {
  try {
    if (!window.ic?.canister) {
      throw new Error('IC interface not initialized');
    }

    await window.ic.canister.call(
      alertId,
      'handle_alert',
      { action }
    );
    return true;
  } catch (error) {
    console.error('Failed to handle alert:', error);
    return false;
  }
}

// Initialize IC interface
export function initializeIC(agent: HttpAgent): void {
  window.ic = {
    agent,
    HttpAgent,
    canister: {
      async call(
        canisterId: string | Principal,
        methodName: string,
        args: Record<string, unknown> = {}
      ) {
        try {
          if (!agent) {
            throw new Error('Agent not initialized');
          }

          // Convert canisterId to Principal if needed
          const principalId = typeof canisterId === 'string' 
            ? Principal.fromText(canisterId)
            : canisterId;

          // Make the actual call
          const response = await agent.call(
            principalId,
            methodName,
            args
          );

          return response;
        } catch (error) {
          console.error(`IC call failed: ${methodName}`, error);
          throw error;
        }
      }
    }
  };
}