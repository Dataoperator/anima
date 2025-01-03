import { Principal } from '@dfinity/principal';

export type MediaSource = 'youtube' | 'tiktok' | 'web' | 'local';

export interface MediaMetadata {
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  source: MediaSource;
  sourceUrl: string;
}

export type MediaActionType = 
  | 'search'
  | 'play'
  | 'pause'
  | 'stop'
  | 'seek'
  | 'adjustVolume'
  | 'changeSource'
  | 'load'
  | 'synchronize';

export interface MediaAction {
  type: MediaActionType;
  source?: MediaSource;
  payload: {
    query?: string;
    url?: string;
    timestamp?: number;
    volume?: number;
    metadata?: MediaMetadata;
  };
  initiator: {
    type: 'anima' | 'user';
    id: Principal | string;
  };
  timestamp: number;
}

export interface MediaState {
  currentUrl: string | null;
  isPlaying: boolean;
  volume: number;
  timestamp: number;
  currentMedia?: MediaMetadata;
  history: Array<{
    action: MediaAction;
    timestamp: number;
  }>;
  preferences?: {
    autoplay: boolean;
    defaultVolume: number;
    preferredSources: MediaSource[];
  };
}

export interface MediaSearchResult {
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  source: MediaSource;
  relevanceScore?: number;
}

export interface MediaControlCapabilities {
  canPlay: boolean;
  canPause: boolean;
  canSeek: boolean;
  canAdjustVolume: boolean;
  supportedSources: MediaSource[];
}

export interface MediaEventCallback {
  onStateChange?: (newState: MediaState) => void;
  onError?: (error: Error) => void;
  onActionComplete?: (action: MediaAction, result: any) => void;
  onMediaEnd?: () => void;
  onBuffering?: (isBuffering: boolean) => void;
}

export interface MediaPermissions {
  allowedSources: MediaSource[];
  maxDuration?: number;
  volumeRange?: {
    min: number;
    max: number;
  };
  allowAutoplay: boolean;
  allowExternalUrls: boolean;
}

export type MediaErrorType = 
  | 'NOT_FOUND'
  | 'UNSUPPORTED_SOURCE'
  | 'PERMISSION_DENIED'
  | 'NETWORK_ERROR'
  | 'INVALID_STATE'
  | 'PLAYBACK_ERROR';

export interface MediaError extends Error {
  type: MediaErrorType;
  action?: MediaAction;
  recoverable: boolean;
  retryable: boolean;
}