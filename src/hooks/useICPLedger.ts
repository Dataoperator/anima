import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ICPLedgerService } from '@/services/icp-ledger';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';
import { createICPLedgerActor } from '@/ic-init';

export const useICPLedger = () => {
  const [ledger, setLedger] = useState<ICPLedgerService>();
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const { identity } = useAuth();
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const initLedger = async () => {
      if (!identity || isInitializing) return;
      
      try {
        setIsInitializing(true);
        console.log('🔄 Connecting to ICP ledger...');
        
        // Create ledger actor first
        const ledgerActor = await createICPLedgerActor(identity);
        if (!ledgerActor) {
          throw new Error('Failed to create ledger actor');
        }

        // Get service instance
        const service = ICPLedgerService.getInstance(ledgerActor);
        
        // Initialize the service
        await service.initialize();

        if (mounted) {
          console.log('✅ ICP ledger connected successfully');
          setLedger(service);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Failed to connect to ICP ledger:', err);
        
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`🔄 Retrying ledger connection (${retryCount}/${MAX_RETRIES})...`);
          setTimeout(initLedger, 1000 * retryCount); // Exponential backoff
          return;
        }

        errorTracker.trackError({
          type: 'IcpLedgerConnectionError',
          category: ErrorCategory.PAYMENT,
          severity: ErrorSeverity.HIGH,
          message: err instanceof Error ? err.message : 'ICP ledger connection failed',
          timestamp: new Date(),
          context: { 
            identity: identity.getPrincipal().toString(),
            retryCount
          }
        });

        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to connect to ICP ledger');
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    initLedger();

    return () => {
      mounted = false;
    };
  }, [identity]);

  const retryInit = async () => {
    if (!identity || isInitializing) return;

    setError(null);
    setIsInitializing(true);

    try {
      const ledgerActor = await createICPLedgerActor(identity);
      if (!ledgerActor) {
        throw new Error('Failed to create ledger actor');
      }

      const service = ICPLedgerService.getInstance(ledgerActor);
      await service.initialize();
      setLedger(service);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect to ICP ledger');
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    ledger,
    error,
    isInitializing,
    retryInit
  };
};