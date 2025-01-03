import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { canisterId, createActor, idlFactory } from '@/declarations/anima';
import type { _SERVICE as AnimaService } from '@/declarations/anima/anima.did';

// Store actor with its identity for validation
let actorCache: {
  actor: AnimaService | null;
  identity: Identity | null;
} = {
  actor: null,
  identity: null
};

export const getAnimaActor = async (identity?: Identity | null): Promise<AnimaService> => {
  if (!identity) {
    console.error('No identity provided to getAnimaActor');
    throw new Error('Authentication required');
  }

  // Check if we need to invalidate cached actor
  const shouldCreateNewActor = !actorCache.actor || 
    !actorCache.identity ||
    actorCache.identity.getPrincipal().toText() !== identity.getPrincipal().toText();

  if (shouldCreateNewActor) {
    try {
      console.log('Creating new actor with:', {
        canisterId,
        principal: identity.getPrincipal().toText(),
        network: process.env.DFX_NETWORK
      });

      const actor = createActor(canisterId, {
        agentOptions: {
          identity,
          host: process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : undefined
        }
      });

      // Test actor connection
      try {
        const principal = identity.getPrincipal();
        console.log('Testing actor connection with principal:', principal.toText());
        const testResult = await actor.get_user_animas(principal);
        console.log('Actor test successful, found animas:', testResult);
      } catch (testError) {
        console.error('Actor test failed:', testError);
        throw new Error('Actor validation failed');
      }

      // Cache the working actor
      actorCache = {
        actor,
        identity
      };

      console.log('New actor created and cached successfully');
    } catch (error) {
      console.error('Failed to create actor:', error);
      throw new Error('Failed to initialize connection');
    }
  } else {
    console.log('Using cached actor for principal:', identity.getPrincipal().toText());
  }

  return actorCache.actor!;
};