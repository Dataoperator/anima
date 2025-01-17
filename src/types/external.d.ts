declare module 'buffer-crc32' {
    function crc32(input: string | Buffer): Buffer;
    export = crc32;
}

declare module 'uuid' {
    export function v4(): string;
}

declare global {
    interface Window {
        ic: {
            agent: any;
            HttpAgent: any;
            canister: {
                call: (canisterId: string, methodName: string, args?: any) => Promise<any>;
            };
        };
        fs: {
            readFile: (path: string, options?: { encoding?: string }) => Promise<any>;
            writeFile: (path: string, content: string) => Promise<void>;
        };
        canister?: any;
    }
}

declare module '@dfinity/agent' {
    export interface Identity {
        getPrincipal(): Principal;
    }
    export class HttpAgent {
        constructor(options: any);
        fetchRootKey(): Promise<void>;
    }
    export class Actor {
        static createActor: any;
    }
    export type ActorSubclass<T> = T;
    export interface ActorConfig {
        agent: HttpAgent;
        canisterId: Principal;
    }
}

declare module '@dfinity/principal' {
    export class Principal {
        static fromText(text: string): Principal;
        toText(): string;
    }
}