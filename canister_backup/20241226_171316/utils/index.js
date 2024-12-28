export { initializeAgent, createAuthClient } from './agent';
export { cn } from './cn';

// This is used to help detect and handle network issues
export const isOnline = () => {
  return window.navigator.onLine;
};

// Helper for handling API timeouts
export const withTimeout = (promise, timeout = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    ),
  ]);
};