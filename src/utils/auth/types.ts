import type { Identity } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";

export interface AgentOptions {
  host?: string;
  identity?: Identity;
}

export interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  identity: Identity | null;
  principal: Principal | null;
}

export interface AuthConfig {
  identityProvider?: string;
  maxTimeToLive?: bigint;
  derivationOrigin?: string;
  windowOpenerFeatures?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  identity?: Identity;
  principal?: Principal;
}

export interface AuthMetrics {
  totalLogins: number;
  failedAttempts: number;
  lastLogin: bigint | null;
  currentIdentity: Identity | null;
}

export interface AuthEvent {
  type: 'LOGIN' | 'LOGOUT' | 'ERROR';
  timestamp: bigint;
  principal?: Principal;
  metadata?: Record<string, unknown>;
}