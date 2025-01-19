import { Principal } from '@dfinity/principal';
import { 
  AnimaNFT, 
  MintConfig, 
  MintResult, 
  NFTResult, 
  AnimaStats,
  AnimaFilter,
  NFTError
} from '@/types/nft';
import { ErrorTelemetry } from '@/error/telemetry';
import { QuantumStateManager } from '@/quantum/StateManager';
import { generateQuantumSignature } from '@/utils/quantum';

export class NFTService {
  private static instance: NFTService;
  private telemetry: ErrorTelemetry;
  private quantumStateManager: QuantumStateManager;

  private constructor() {
    this.telemetry = ErrorTelemetry.getInstance('nft');
    this.quantumStateManager = QuantumStateManager.getInstance();
  }

  public static getInstance(): NFTService {
    if (!NFTService.instance) {
      NFTService.instance = new NFTService();
    }
    return NFTService.instance;
  }

  public async mintAnima(
    config: MintConfig,
    owner: Principal
  ): Promise<NFTResult<MintResult>> {
    try {
      const actor = window.canister;
      if (!actor) throw new Error('Canister not initialized');

      // Initialize quantum state
      const initialState = await this.quantumStateManager.initializeQuantumState();

      // Prepare mint call
      const mintArgs = {
        owner,
        name: config.name,
        metadata: {
          name: config.name,
          description: `ANIMA NFT - ${config.name}`,
          image: '', // Will be generated
          edition: config.edition,
          evolutionLevel: 1,
          genesisTraits: config.traits || [],
          achievements: [],
          quantumSignature: generateQuantumSignature(),
          creationTime: BigInt(Date.now()),
          lastUpdate: BigInt(Date.now())
        },
        quantumState: {
          ...initialState,
          ...config.initialQuantumState
        }
      };

      // Call mint function
      const result = await actor.mint_anima(mintArgs);
      
      if ('Err' in result) {
        throw new Error(result.Err.message);
      }

      return {
        Ok: {
          anima: result.Ok.anima,
          transactionId: result.Ok.txId,
          mintTime: BigInt(Date.now())
        }
      };

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'MINT_ERROR',
        severity: 'HIGH',
        context: 'mintAnima',
        error: error instanceof Error ? error : new Error('Minting failed')
      });

      return {
        Err: {
          code: 'MINT_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error occurred during minting'
        }
      };
    }
  }

  public async interactWithAnima(
    tokenId: bigint,
    interactionType: string,
    data?: Record<string, unknown>
  ): Promise<NFTResult<AnimaStats>> {
    try {
      const actor = window.canister;
      if (!actor) throw new Error('Canister not initialized');

      // Process interaction
      const result = await actor.interact_with_anima({
        tokenId,
        interactionType,
        data: data || {},
        timestamp: BigInt(Date.now())
      });

      if ('Err' in result) {
        throw new Error(result.Err.message);
      }

      return { Ok: result.Ok };

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'INTERACTION_ERROR',
        severity: 'HIGH',
        context: 'interactWithAnima',
        error: error instanceof Error ? error : new Error('Interaction failed')
      });

      return {
        Err: {
          code: 'INTERACTION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error during interaction'
        }
      };
    }
  }

  public async getAnima(
    tokenId: bigint
  ): Promise<NFTResult<AnimaNFT>> {
    try {
      const actor = window.canister;
      if (!actor) throw new Error('Canister not initialized');

      const result = await actor.get_anima(tokenId);
      if ('Err' in result) {
        throw new Error(result.Err.message);
      }

      return { Ok: result.Ok };

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'GET_ANIMA_ERROR',
        severity: 'MEDIUM',
        context: 'getAnima',
        error: error instanceof Error ? error : new Error('Failed to fetch ANIMA')
      });

      return {
        Err: {
          code: 'GET_ANIMA_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error fetching ANIMA'
        }
      };
    }
  }

  public async getUserAnimas(
    owner: Principal,
    filter?: AnimaFilter
  ): Promise<NFTResult<AnimaNFT[]>> {
    try {
      const actor = window.canister;
      if (!actor) throw new Error('Canister not initialized');

      const result = await actor.get_user_animas(owner, filter || {});
      if ('Err' in result) {
        throw new Error(result.Err.message);
      }

      return { Ok: result.Ok };

    } catch (error) {
      await this.telemetry.logError({
        errorType: 'GET_USER_ANIMAS_ERROR',
        severity: 'MEDIUM',
        context: 'getUserAnimas',
        error: error instanceof Error ? error : new Error('Failed to fetch user ANIMAs')
      });

      return {
        Err: {
          code: 'GET_USER_ANIMAS_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error fetching user ANIMAs'
        }
      };
    }
  }
}