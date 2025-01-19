import { Actor, HttpAgent, ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../../declarations/anima";
import { _SERVICE } from "../../declarations/anima/anima.did";
import { ErrorTelemetry } from '../../error/telemetry';
import { NETWORK_CONFIG } from '../../config';

const telemetry = ErrorTelemetry.getInstance('auth');

export interface CreateActorConfig {
  agentOptions?: {
    host?: string;
    identity?: any;
  };
  actorOptions?: {
    agent?: HttpAgent;
  };
}

export async function createActor(
  canisterId: string | Principal,
  options?: CreateActorConfig
): Promise<ActorSubclass<_SERVICE>> {
  const hostUrl = NETWORK_CONFIG.local;
  
  const agent = new HttpAgent({
    host: hostUrl,
    ...options?.agentOptions
  });

  // Fetch root key for local development
  if (NETWORK_CONFIG.local === hostUrl) {
    try {
      await agent.fetchRootKey().catch(console.error);
    } catch (error) {
      await telemetry.logError({
        errorType: 'ROOT_KEY_FETCH_ERROR',
        severity: 'HIGH',
        context: 'createActor',
        error: error instanceof Error ? error : new Error('Failed to fetch root key')
      });
    }
  }

  try {
    // Create actor using the Agent
    return Actor.createActor(idlFactory, {
      agent,
      canisterId: typeof canisterId === 'string' ? Principal.fromText(canisterId) : canisterId,
      ...options?.actorOptions
    });
  } catch (error) {
    await telemetry.logError({
      errorType: 'ACTOR_CREATION_ERROR',
      severity: 'HIGH',
      context: 'createActor',
      error: error instanceof Error ? error : new Error('Failed to create actor')
    });
    throw error;
  }
}