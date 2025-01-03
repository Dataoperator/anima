import React, { useEffect, useRef } from 'react';
import { RateLimiter } from '@/utils/RateLimiter';

interface InitializationManagerProps {
  children: React.ReactNode;
}

const rateLimiter = new RateLimiter(60000, 45); // 45 requests per minute

export const InitializationManager: React.FC<InitializationManagerProps> = ({ children }) => {
  const initRef = useRef<boolean>(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Add listener for dfinity.js loading
    const script = document.querySelector('script[src*="dfinity"]');
    if (script) {
      script.addEventListener('load', () => {
        console.log('✅ Dfinity library loaded successfully');
      });

      script.addEventListener('error', (error) => {
        console.error('❌ Failed to load Dfinity library:', error);
      });
    }

    // Clean up any remaining rate limiting data on unmount
    return () => {
      initRef.current = false;
    };
  }, []);

  return <>{children}</>;
};

export async function initializeWithRateLimit<T>(
  key: string,
  initFunction: () => Promise<T>
): Promise<T> {
  await rateLimiter.throttle(key);
  return initFunction();
}