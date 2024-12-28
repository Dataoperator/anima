export const II_URL = process.env.DFX_NETWORK === 'local'
  ? `http://localhost:${process.env.VITE_II_LOCAL_PORT}`
  : 'https://identity.ic0.app';

export const II_CONFIG = {
  derivationOrigin: process.env.DFX_NETWORK === 'local'
    ? `http://localhost:${process.env.VITE_II_LOCAL_PORT}`
    : process.env.II_URL || 'https://identity.ic0.app',
  maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000) // 7 days
};