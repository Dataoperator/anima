import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ActorSubclass } from '@dfinity/agent';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { _SERVICE } from '@/declarations/anima/anima.did';
import { createActor } from '@/declarations/anima';

export interface AuthState {
    isAuthenticated: boolean;
    identity: Identity | null;
    principal: Principal | null;
    actor: ActorSubclass<_SERVICE> | null;
    shouldAutoConnect: boolean;
}

export interface AuthContextType extends AuthState {
    login: () => Promise<void>;
    logout: () => Promise<void>;
    toggleAutoConnect: () => void;
}

const initialState: AuthState = {
    isAuthenticated: false,
    identity: null,
    principal: null,
    actor: null,
    shouldAutoConnect: localStorage.getItem('shouldAutoConnect') === 'true'
};

type AuthAction = 
    | { type: 'SET_AUTH'; payload: Partial<AuthState> }
    | { type: 'CLEAR_AUTH' }
    | { type: 'TOGGLE_AUTO_CONNECT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_AUTH':
            return { ...state, ...action.payload };
        case 'CLEAR_AUTH':
            return { ...initialState, shouldAutoConnect: state.shouldAutoConnect };
        case 'TOGGLE_AUTO_CONNECT':
            const shouldAutoConnect = !state.shouldAutoConnect;
            localStorage.setItem('shouldAutoConnect', String(shouldAutoConnect));
            return { ...state, shouldAutoConnect };
    }
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = async () => {
        try {
            const authClient = await AuthClient.create();
            
            await new Promise<void>((resolve) => {
                authClient.login({
                    identityProvider: process.env.II_URL,
                    onSuccess: () => resolve(),
                });
            });

            const identity = await authClient.getIdentity();
            const principal = identity.getPrincipal();
            
            const actor = createActor(process.env.CANISTER_ID_ANIMA || '', {
                agentOptions: { identity }
            });

            dispatch({
                type: 'SET_AUTH',
                payload: { isAuthenticated: true, identity, principal, actor }
            });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const authClient = await AuthClient.create();
            await authClient.logout();
            dispatch({ type: 'CLEAR_AUTH' });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const toggleAutoConnect = () => {
        dispatch({ type: 'TOGGLE_AUTO_CONNECT' });
    };

    useEffect(() => {
        if (state.shouldAutoConnect) {
            const initAuth = async () => {
                try {
                    const authClient = await AuthClient.create();
                    
                    if (await authClient.isAuthenticated()) {
                        const identity = await authClient.getIdentity();
                        const principal = identity.getPrincipal();
                        
                        const actor = createActor(process.env.CANISTER_ID_ANIMA || '', {
                            agentOptions: { identity }
                        });

                        dispatch({
                            type: 'SET_AUTH',
                            payload: { isAuthenticated: true, identity, principal, actor }
                        });
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error);
                }
            };
            
            initAuth();
        }
    }, [state.shouldAutoConnect]);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                toggleAutoConnect
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};