import { Principal } from '@dfinity/principal';

// Extend Principal functionality
declare module '@dfinity/principal' {
  interface Principal {
    isAnonymous(): boolean;
    toUint8Array(): Uint8Array;
    toString(): string;
    toText(): string;
    toHex(): string;
  }
}

// Add Principal utility functions
export function isValidPrincipal(principal: Principal | string): boolean {
  try {
    const p = typeof principal === 'string' ? Principal.fromText(principal) : principal;
    return !p.isAnonymous();
  } catch {
    return false;
  }
}

export function principalToUint8Array(principal: Principal): Uint8Array {
  return principal.toUint8Array();
}

export function uint8ArrayToPrincipal(arr: Uint8Array): Principal {
  return Principal.fromUint8Array(arr);
}

// Extended window interface for IC
declare global {
  interface Window {
    ic: {
      agent: any;
      HttpAgent: any;
      canister: {
        call: <T = any>(
          canisterId: Principal | string,
          methodName: string,
          args?: Record<string, unknown>
        ) => Promise<T>;
      };
    };
    canister: any;
  }
}