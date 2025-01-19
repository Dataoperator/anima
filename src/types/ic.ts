import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

export interface ICResponse<T> {
  Ok: T;
  Err?: string;
}

export interface ICCanister {
  call<T = any>(
    canisterId: Principal | string,
    methodName: string,
    args?: Record<string, unknown>
  ): Promise<ICResponse<T>>;
}

export interface IC {
  agent: HttpAgent | null;
  HttpAgent: typeof HttpAgent;
  canister: ICCanister;
}

export interface ICConfig {
  HOST: string;
  LOCAL_HOST: string;
  CANISTER_ID: string;
  NETWORK: 'local' | 'ic';
}

export interface ICWindow extends Window {
  ic: IC;
  canister: any;
}

export interface ICError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ICMetrics {
  cyclesBalance: bigint;
  memorySize: bigint;
  heapSize: bigint;
  stableMemorySize: bigint;
}

export interface ICResult<T> {
  Ok: T;
  Err: ICError;
}

export interface ICStats {
  timeNanos: bigint;
  cyclesConsumed: bigint;
  memoryUsed: bigint;
  heapUsed: bigint;
}

// Agent Management
export interface ICAgentConfig {
  host: string;
  canisterId: string | Principal;
  options?: {
    maxAttempts?: number;
    delayBetweenAttempts?: number;
  };
}

export interface ICIdentity {
  getPrincipal(): Principal;
  transformRequest(request: RequestInit): Promise<RequestInit>;
}

// Canister Management
export interface ICCanisterStatus {
  status: "running" | "stopping" | "stopped";
  memory_size: bigint;
  cycles: bigint;
  settings: {
    freezing_threshold: bigint;
    controllers: Principal[];
    memory_allocation: bigint;
    compute_allocation: bigint;
  };
  moduleHash: string | null;
}

export interface ICCanisterInfo {
  id: Principal;
  name: string;
  type: string;
  status: ICCanisterStatus;
}

// System Interfaces
export interface ICSystemState {
  time: bigint;
  canisterCycles: bigint;
  memorySize: bigint;
  heapSize: bigint;
  certified: boolean;
}

export interface ICBlob {
  data: Uint8Array;
  totalLength: number;
  sha256: Uint8Array;
}

export interface ICHttpResponse {
  status: number;
  headers: [string, string][];
  body: ICBlob;
}

export interface ICHttpRequest {
  method: string;
  url: string;
  headers: [string, string][];
  body: ICBlob;
}

// Asset Management
export interface ICAssetProperties {
  contentType: string;
  encodings: {
    contentEncoding: string;
    sha256: Uint8Array;
    length: bigint;
  }[];
  totalLength: bigint;
}

export interface ICAssetKey {
  name: string;
  contentType: string;
  hash: Uint8Array;
}

// Batch Operations
export interface ICBatchOperation<T> {
  operations: T[];
  callback?: (results: ICResult<any>[]) => void;
  maxConcurrent?: number;
}