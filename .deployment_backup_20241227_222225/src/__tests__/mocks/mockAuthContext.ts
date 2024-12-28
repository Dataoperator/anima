import { Principal } from '@dfinity/principal';
import { ActorSubclass, ActorMethodMap, Actor } from '@dfinity/agent';
import type { AuthContextType } from '@/contexts/AuthContext';
import type { _SERVICE } from '@/declarations/anima/anima.did';
import { MockIdentity } from './MockIdentity';
import { createActor } from '@/declarations/anima';

const metadataSymbol = Symbol.for('ic-agent-metadata');

type MockActor = ActorSubclass<_SERVICE> & {
  [metadataSymbol]: {
    canisterId: Principal;
  };
};

export const createMockActor = (): MockActor => {
  // Create base actor
  const baseActor = createActor(Principal.fromText('lpp2u-jyaaa-aaaaj-qngka-cai'), {
    agentOptions: {
      identity: new MockIdentity(),
    }
  });

  // Mock methods with proper types
  const mockMethods: Partial<ActorMethodMap<_SERVICE>> = {
    get_payment_settings: jest.fn().mockResolvedValue({
      Ok: {
        creation_fee: BigInt(1000000),
        resurrection_fee: BigInt(500000),
        growth_pack_base_fee: BigInt(100000),
        fee_recipient: Principal.fromText('2vxsx-fae')
      }
    }),
    get_health_check: jest.fn().mockResolvedValue({
      cycles: BigInt(1_000_000_000_000),
      memory_used: BigInt(100_000_000),
      heap_memory: BigInt(50_000_000),
      stable_memory_size: BigInt(200_000_000)
    }),
    get_system_stats: jest.fn().mockResolvedValue({
      total_animas: BigInt(100),
      active_users: BigInt(50),
      total_transactions: BigInt(1000),
      memory_usage_percent: 45.5
    }),
    check_autonomous_messages: jest.fn().mockResolvedValue([]),
    create_anima: jest.fn().mockResolvedValue({ Ok: Principal.fromText('2vxsx-fae') }),
    get_anima: jest.fn().mockResolvedValue({ Ok: null }),
    get_user_animas: jest.fn().mockResolvedValue([]),
    get_marketplace_listings: jest.fn().mockResolvedValue([]),
    list_token: jest.fn().mockResolvedValue({ Ok: null })
  };

  // Combine base actor with mocks and add metadata
  const mockActor = {
    ...baseActor,
    ...mockMethods,
    [metadataSymbol]: {
      canisterId: Principal.fromText('lpp2u-jyaaa-aaaaj-qngka-cai')
    }
  } as MockActor;

  return mockActor;
};

export const mockAuthContext: AuthContextType = {
  isAuthenticated: true,
  identity: new MockIdentity(),
  principal: Principal.fromText('2vxsx-fae'),
  actor: createMockActor(),
  login: jest.fn(),
  logout: jest.fn(),
  shouldAutoConnect: false,
  toggleAutoConnect: jest.fn()
};