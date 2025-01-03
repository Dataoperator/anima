import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ICPLedgerService } from '@/services/icp-ledger';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';

export const useICPLedger = () => {
  const [ledger, setLedger] = useState<ICPLedgerService>();
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const { identity } = useAuth();
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    let mounted = true;

    const initLedger = async () => {
      if (!identity || isInitializing) return;

      setIsInitializing(true);

      try {
        console.log('🔄 Connecting to ICP ledger...');
        const service = new ICPLedgerService(identity);
        await service.initialize();

        if (mounted) {
          console.log('✅ ICP ledger connected successfully');
          setLedger(service);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Failed to connect to ICP ledger:', err);
        
        errorTracker.trackError(
          ErrorCategory.PAYMENT,
          err instanceof Error ? err : new Error('ICP ledger connection failed'),
          ErrorSeverity.HIGH,
          { identity: identity.getPrincipal().toString() }
        );

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
      const service = new ICPLedgerService(identity);
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