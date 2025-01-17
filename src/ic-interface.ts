import { HttpAgent } from '@dfinity/agent';

declare global {
    interface Window {
        ic: {
            agent: HttpAgent | null;
            HttpAgent: typeof HttpAgent;
            canister: {
                call: <T = any>(
                    canisterId: string,
                    methodName: string,
                    args?: any
                ) => Promise<T>;
            };
        };
    }
}

export const initializeIC = () => {
    if (typeof window !== 'undefined') {
        window.ic = {
            ...window.ic,
            canister: {
                call: async (canisterId: string, methodName: string, args?: any) => {
                    if (!window.ic.agent) {
                        throw new Error('IC Agent not initialized');
                    }
                    
                    try {
                        const actor = window.canister;
                        if (!actor || typeof actor[methodName] !== 'function') {
                            throw new Error(`Method ${methodName} not found on actor`);
                        }
                        
                        return await actor[methodName](args);
                    } catch (error) {
                        console.error('IC Call Error:', error);
                        throw error;
                    }
                }
            }
        };
    }
};