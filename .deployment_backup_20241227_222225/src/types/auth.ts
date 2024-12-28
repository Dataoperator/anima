import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE } from '@/declarations/anima/anima.did';

export interface AuthState {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: Principal | null;
  actor: ActorSubclass<_SERVICE> | null;
  shouldAutoConnect: boolean;
}

export type AuthAction =
  | { type: 'SET_AUTH'; payload: Partial<AuthState> }
  | { type: 'CLEAR_AUTH' }
  | { type: 'TOGGLE_AUTO_CONNECT' };

export interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  toggleAutoConnect: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}