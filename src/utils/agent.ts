import { HttpAgent, ActorConfig } from "@dfinity/agent";
import { Principal } from '@dfinity/principal';
import { NETWORK_CONFIG } from '../config';
import { ErrorTelemetry } from '../error/telemetry';

const telemetry = new ErrorTelemetry('agent');

export interface AgentOptions {
    identity?: any;
    host?: string;
}

export async function createAgent(options: AgentOptions = {}): Promise<HttpAgent> {
    const agent = new HttpAgent({
        identity: options.identity,
        host: options.host || NETWORK_CONFIG.local
    });

    if (NETWORK_CONFIG.local) {
        try {
            await agent.fetchRootKey();
        } catch (error) {
            telemetry.logError('fetch_root_key_error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                host: options.host
            });
            throw error;
        }
    }

    return agent;
}

export function getCanisterId(name: string): Principal {
    try {
        return Principal.fromText(process.env[`CANISTER_ID_${name.toUpperCase()}`] || '');
    } catch (error) {
        telemetry.logError('get_canister_id_error', {
            error: error instanceof Error ? error.message : 'Unknown error',
            canister: name
        });
        throw error;
    }
}