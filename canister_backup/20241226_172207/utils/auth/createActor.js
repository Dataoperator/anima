import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "@/declarations/anima";
import { canisterEnv } from "@/config/canisterEnv";
import { ActorError, logError } from "@/utils/errorReporting";

export const createAnimaActor = async (identity) => {
  const contextDetails = {
    canisterId: canisterEnv.anima,
    host: canisterEnv.host,
    isLocal: canisterEnv.isLocal,
    hasIdentity: !!identity
  };

  try {
    if (!identity) {
      throw new ActorError('No identity provided for actor creation', contextDetails);
    }

    const agent = new HttpAgent({
      identity,
      host: canisterEnv.host,
      verifyQuerySignatures: canisterEnv.isLocal ? false : true
    });

    if (canisterEnv.isLocal) {
      try {
        await agent.fetchRootKey().catch(e => {
          throw new ActorError('Failed to fetch root key in local mode', {
            ...contextDetails,
            error: e.message
          });
        });
      } catch (error) {
        logError(error, { operation: 'fetchRootKey' });
        throw error;
      }
    }

    try {
      const actor = await Actor.createActor(idlFactory, {
        agent,
        canisterId: canisterEnv.anima
      });

      // Simple verification call
      await actor.icrc7_name().catch(() => {
        // Silently handle verification error - not all canisters will have this method
      });

      return actor;
    } catch (error) {
      throw new ActorError('Failed to create or verify actor', {
        ...contextDetails,
        verificationError: error.message
      });
    }
  } catch (error) {
    const enrichedError = new ActorError(
      `Actor creation failed: ${error.message}`,
      {
        ...contextDetails,
        originalError: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }
    );
    logError(enrichedError);
    throw enrichedError;
  }
};