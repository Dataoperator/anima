import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeService } from '@/services/RealtimeService';
import type { 
    PersonalityUpdate, 
    SubscriptionOptions, 
    RealtimeHookState,
    WebSocketError,
    RealtimeMessage,
    UpdateType
} from '@/types/realtime';

const REALTIME_ENDPOINT = process.env.NEXT_PUBLIC_REALTIME_ENDPOINT || 'wss://realtime.anima.local/ws';

export function useRealtimePersonality(
    animaId: string,
    options: SubscriptionOptions = {}
): RealtimeHookState {
    const [state, setState] = useState<RealtimeHookState>({
        personality: null,
        loading: true,
        error: null,
        connectionMode: 'polling'
    });
    
    const { actor } = useAuth();

    const handleRealtimeMessage = useCallback((message: RealtimeMessage) => {
        switch (message.type) {
            case UpdateType.UPDATE:
                const update = message.payload as PersonalityUpdate;
                setState(prev => ({
                    ...prev,
                    personality: {
                        ...prev.personality,
                        ...(options.includeQuantumState && {
                            quantum_traits: update.quantum_traits
                        }),
                        ...(options.includeEmotionalState && {
                            emotional_state: update.emotional_state
                        }),
                        ...(options.includeConsciousness && {
                            consciousness: update.consciousness
                        }),
                        ...(options.includeDimensions && {
                            dimensional_awareness: update.dimensional_awareness
                        }),
                        timestamp: update.timestamp,
                        growth_level: update.growth_level
                    },
                    error: null
                }));
                break;

            case UpdateType.ERROR:
                const error = message.payload as WebSocketError;
                setState(prev => ({
                    ...prev,
                    error,
                    loading: false
                }));
                break;

            case UpdateType.CONNECTED:
                setState(prev => ({
                    ...prev,
                    connectionMode: 'realtime',
                    error: null
                }));
                break;

            case UpdateType.DISCONNECTED:
                setState(prev => ({
                    ...prev,
                    connectionMode: 'polling',
                    error: null
                }));
                break;
        }
    }, [options]);

    useEffect(() => {
        if (!actor) {
            setState(prev => ({
                ...prev,
                error: {
                    code: 401,
                    message: 'Authentication required'
                }
            }));
            return;
        }

        setState(prev => ({ ...prev, loading: true }));

        const realtimeService = new RealtimeService(REALTIME_ENDPOINT);

        const initialize = async () => {
            try {
                // Get initial state through actor
                const initialState = await actor.get_personality_state(animaId);
                
                setState(prev => ({
                    ...prev,
                    personality: initialState,
                    loading: false,
                    error: null
                }));

                // Set up realtime connection
                await realtimeService.connect();
                realtimeService.addEventListener(handleRealtimeMessage);
                await realtimeService.subscribe(animaId, options);

            } catch (err) {
                setState(prev => ({
                    ...prev,
                    error: {
                        code: 500,
                        message: 'Failed to initialize personality state',
                        details: { error: err }
                    },
                    loading: false
                }));
            }
        };

        initialize();

        // Cleanup
        return () => {
            realtimeService.removeEventListener(handleRealtimeMessage);
            realtimeService.unsubscribe(animaId).catch(console.error);
            realtimeService.disconnect();
        };
    }, [animaId, actor, options, handleRealtimeMessage]);

    return state;
}