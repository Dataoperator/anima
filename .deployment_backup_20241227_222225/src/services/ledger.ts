import { ActorSubclass, Agent, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AccountIdentifier, SubAccount } from './types/ledger';

interface TransferParams {
    amount: { e8s: bigint };
    to: Principal;
    memo?: bigint;
    fromSubaccount?: SubAccount | null;
    createdAt?: bigint | null;
}

export interface LedgerActor extends ActorSubclass<any> {
    transfer: (params: TransferParams) => Promise<{ height: bigint }>;
    account_balance: (params: { account: AccountIdentifier }) => Promise<{ e8s: bigint }>;
}

export class LedgerService {
    private static instance: LedgerService;
    private actor: LedgerActor | null = null;
    private agent: Agent | null = null;
    
    private constructor() {}

    public static getInstance(): LedgerService {
        if (!LedgerService.instance) {
            LedgerService.instance = new LedgerService();
        }
        return LedgerService.instance;
    }

    public async initialize(identity: any): Promise<void> {
        this.agent = new HttpAgent({
            host: 'https://ic0.app',
            identity
        });

        const canisterId = process.env.LEDGER_CANISTER_ID;
        if (!canisterId) {
            throw new Error('Ledger canister ID not configured');
        }

        try {
            this.actor = await this.createLedgerActor(
                canisterId, 
                this.agent
            );
        } catch (error) {
            console.error('Failed to initialize ledger:', error);
            throw new Error('Ledger initialization failed');
        }
    }

    private async createLedgerActor(canisterId: string, agent: Agent): Promise<LedgerActor> {
        const { idlFactory } = await import('@dfinity/ledger-icp');
        return await Actor.createActor<LedgerActor>(idlFactory, {
            agent,
            canisterId: Principal.fromText(canisterId)
        });
    }

    public async transfer(params: TransferParams): Promise<bigint> {
        if (!this.actor) {
            throw new Error('Ledger not initialized');
        }

        try {
            const result = await this.actor.transfer({
                ...params,
                createdAt: params.createdAt || BigInt(Date.now() * 1000000),
                memo: params.memo || BigInt(0)
            });
            return result.height;
        } catch (error) {
            console.error('Transfer failed:', error);
            throw error;
        }
    }

    public async getBalance(accountIdentifier: AccountIdentifier): Promise<bigint> {
        if (!this.actor) {
            throw new Error('Ledger not initialized');
        }

        try {
            const result = await this.actor.account_balance({
                account: accountIdentifier
            });
            return result.e8s;
        } catch (error) {
            console.error('Failed to get balance:', error);
            throw error;
        }
    }

    public isInitialized(): boolean {
        return this.actor !== null;
    }
}