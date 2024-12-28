// Constants for II configuration
const ASSET_CANISTER_ID = process.env.CANISTER_ID_ANIMA_ASSETS || process.env.ANIMA_ASSETS_CANISTER_ID;
const II_DOMAIN = process.env.DFX_NETWORK === 'ic' ? 'ic0.app' : 'localhost:4943';

// Configuration for the II client
export const II_CONFIG = {
  maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
  idleOptions: {
    disableIdle: true,
    idleTimeout: 1000 * 60 * 30, // 30 minutes
  },
  derivationOrigin: process.env.DFX_NETWORK === 'ic' 
    ? 'https://identity.ic0.app'
    : `http://localhost:4943?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`,
};

// URL configurations
export const II_URL = process.env.DFX_NETWORK === 'ic' 
  ? 'https://identity.ic0.app'
  : `http://localhost:4943?canisterId=${process.env.II_CANISTER_ID}`;

export const LOCAL_HOST = 'http://localhost:4943';
export const IC_HOST = `https://${ASSET_CANISTER_ID}.${II_DOMAIN}`;
export const APP_HOST = process.env.DFX_NETWORK === 'ic' ? IC_HOST : LOCAL_HOST;

export const ALTERNATIVE_ORIGINS = [
  `https://${ASSET_CANISTER_ID}.icp0.io`,
  `https://${ASSET_CANISTER_ID}.raw.icp0.io`,
  `https://${ASSET_CANISTER_ID}.ic0.app`,
  `https://${ASSET_CANISTER_ID}.raw.ic0.app`
];

// Error handling helpers
export const II_ERRORS = {
  INVALID_DERIVATION: 'Invalid derivation origin',
  NETWORK_ERROR: 'Network error during II authentication',
  USER_INTERRUPT: 'User interrupted authentication',
  TIMEOUT: 'Authentication timeout'
};

// Validation helpers
export const validateIIResponse = (response) => {
  if (!response || !response.delegation) {
    throw new Error(II_ERRORS.INVALID_DERIVATION);
  }
  return response;
};