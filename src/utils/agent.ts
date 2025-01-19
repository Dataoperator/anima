import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { ErrorTelemetry } from '../error/telemetry';

const telemetry = ErrorTelemetry.getInstance('agent');

export interface AgentOptions {
  host?: string;
  identity?: any;
}

export async function createAgent(options: AgentOptions = {}): Promise<HttpAgent> {
  try {
    const agent = new HttpAgent({
      host: options.host || 'https://icp0.io',
      identity: options.identity
    });

    // Fetch root key for local development
    if (process.env.NODE_ENV !== 'production') {
      try {
        await agent.fetchRootKey();
      } catch (error) {
        await telemetry.logError({
          errorType: 'FETCH_ROOT_KEY_ERROR',
          severity: 'HIGH',
          context: 'createAgent',
          error: error instanceof Error ? error : new Error('Failed to fetch root key')
        });
      }
    }

    return agent;
  } catch (error) {
    await telemetry.logError({
      errorType: 'AGENT_CREATION_ERROR',
      severity: 'HIGH',
      context: 'createAgent',
      error: error instanceof Error ? error : new Error('Failed to create agent')
    });
    throw error;
  }
}

export async function getCanisterId(name: string): Promise<Principal> {
  try {
    const canisterId = process.env[`CANISTER_ID_${name.toUpperCase()}`];
    if (!canisterId) {
      throw new Error(`Canister ID not found for ${name}`);
    }
    return Principal.fromText(canisterId);
  } catch (error) {
    await telemetry.logError({
      errorType: 'GET_CANISTER_ID_ERROR',
      severity: 'HIGH',
      context: 'getCanisterId',
      error: error instanceof Error ? error : new Error('Failed to get canister ID')
    });
    throw error;
  }
}

export function validatePrincipal(principal: Principal): boolean {
  try {
    return !principal.isAnonymous();
  } catch {
    return false;
  }
}

export async function validateAgent(agent: HttpAgent): Promise<boolean> {
  try {
    const identity = agent.getIdentity();
    const principal = identity.getPrincipal();
    return validatePrincipal(principal);
  } catch (error) {
    await telemetry.logError({
      errorType: 'AGENT_VALIDATION_ERROR',
      severity: 'HIGH',
      context: 'validateAgent',
      error: error instanceof Error ? error : new Error('Failed to validate agent')
    });
    return false;
  }
}

export async function upgradeAgent(agent: HttpAgent, options: AgentOptions = {}): Promise<HttpAgent> {
  try {
    // Create new agent with updated options
    const newAgent = new HttpAgent({
      ...agent,
      host: options.host || agent.getHost(),
      identity: options.identity || agent.getIdentity()
    });

    // Fetch root key if in development
    if (process.env.NODE_ENV !== 'production') {
      await newAgent.fetchRootKey();
    }

    // Validate the new agent
    const isValid = await validateAgent(newAgent);
    if (!isValid) {
      throw new Error('Upgraded agent validation failed');
    }

    return newAgent;
  } catch (error) {
    await telemetry.logError({
      errorType: 'AGENT_UPGRADE_ERROR',
      severity: 'HIGH',
      context: 'upgradeAgent',
      error: error instanceof Error ? error : new Error('Failed to upgrade agent')
    });
    throw error;
  }
}

export interface CanisterCallOptions {
  method: string;
  args?: unknown[];
  cycles?: bigint;
}

export async function callCanister<T>(
  agent: HttpAgent,
  canisterId: Principal | string,
  options: CanisterCallOptions
): Promise<T> {
  try {
    const principalId = typeof canisterId === 'string' 
      ? Principal.fromText(canisterId)
      : canisterId;

    const result = await agent.call(
      principalId,
      options.method,
      options.args || [],
      options.cycles
    );

    return result as T;
  } catch (error) {
    await telemetry.logError({
      errorType: 'CANISTER_CALL_ERROR',
      severity: 'HIGH',
      context: 'callCanister',
      error: error instanceof Error ? error : new Error('Failed to call canister')
    });
    throw error;
  }
}

export function extendAgent(agent: HttpAgent): HttpAgent & {
  validateIdentity(): Promise<boolean>;
  upgradeAgent(options?: AgentOptions): Promise<HttpAgent>;
  callCanister<T>(canisterId: Principal | string, options: CanisterCallOptions): Promise<T>;
} {
  return {
    ...agent,
    validateIdentity: () => validateAgent(agent),
    upgradeAgent: (options?: AgentOptions) => upgradeAgent(agent, options),
    callCanister: <T>(canisterId: Principal | string, options: CanisterCallOptions) => 
      callCanister<T>(agent, canisterId, options)
  };
}