export const ENV = {
  // Canister IDs
  ANIMA_CANISTER_ID: process.env.ANIMA_CANISTER_ID || "l2ilz-iqaaa-aaaaj-qngjq-cai",
  ASSETS_CANISTER_ID: process.env.ASSETS_CANISTER_ID || "lpp2u-jyaaa-aaaaj-qngka-cai",

  // Identity Provider
  II_URL: process.env.II_URL || "https://identity.ic0.app",

  // Development flags
  IS_DEVELOPMENT: process.env.NODE_ENV !== "production",
  
  // Network configuration
  HOST: process.env.DFX_NETWORK === "ic" 
    ? "https://icp-api.io"
    : `http://localhost:${process.env.DFX_PORT || 4943}`,
};