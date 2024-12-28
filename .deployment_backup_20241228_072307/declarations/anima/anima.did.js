export const idlFactory = ({ IDL }) => {
  const HealthStatus = IDL.Record({
    'status' : IDL.Text,
    'memory_used' : IDL.Nat64,
    'cycles' : IDL.Nat64,
    'heap_memory' : IDL.Nat64,
  });
  const TokenIdentifier = IDL.Nat64;
  const Listing = IDL.Record({
    'token_id' : TokenIdentifier,
    'created_at' : IDL.Nat64,
    'seller' : IDL.Principal,
    'price' : IDL.Nat64,
    'expires_at' : IDL.Opt(IDL.Nat64),
  });
  const PersonalityState = IDL.Record({
    'emotional_state' : IDL.Opt(
      IDL.Record({
        'valence' : IDL.Float64,
        'current_emotion' : IDL.Text,
        'arousal' : IDL.Float64,
        'intensity' : IDL.Float64,
      })
    ),
    'growth_level' : IDL.Nat32,
    'consciousness' : IDL.Opt(
      IDL.Record({
        'awareness_level' : IDL.Float64,
        'growth_velocity' : IDL.Float64,
        'processing_depth' : IDL.Float64,
        'integration_index' : IDL.Float64,
      })
    ),
    'timestamp' : IDL.Nat64,
    'dimensional_awareness' : IDL.Opt(
      IDL.Record({
        'level' : IDL.Nat32,
        'discovered_dimensions' : IDL.Vec(IDL.Text),
        'active_dimension' : IDL.Opt(IDL.Text),
      })
    ),
  });
  const Alert = IDL.Record({
    'id' : IDL.Text,
    'resolved' : IDL.Bool,
    'title' : IDL.Text,
    'message' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'severity' : IDL.Text,
  });
  const SystemStats = IDL.Record({
    'memory_usage_percent' : IDL.Float64,
    'total_transactions' : IDL.Nat64,
    'total_animas' : IDL.Nat64,
    'active_users' : IDL.Nat64,
  });
  const AlertAction = IDL.Record({
    'action_type' : IDL.Text,
    'payload' : IDL.Variant({
      'Custom' : IDL.Record({ 'data' : IDL.Text }),
      'Escalate' : IDL.Record({ 'priority' : IDL.Text }),
      'Acknowledge' : IDL.Null,
    }),
  });
  return IDL.Service({
    'create_anima' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : IDL.Text })],
        [],
      ),
    'get_growth_history' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'nfts' : IDL.Nat64,
              'time' : IDL.Text,
              'users' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'get_health_status' : IDL.Func([], [HealthStatus], ['query']),
    'get_marketplace_listings' : IDL.Func([], [IDL.Vec(Listing)], ['query']),
    'get_payment_address' : IDL.Func([], [IDL.Text], ['query']),
    'get_payment_amount' : IDL.Func(
        [
          IDL.Variant({
            'Creation' : IDL.Null,
            'Upgrade' : IDL.Null,
            'Growth' : IDL.Null,
            'Resurrection' : IDL.Null,
          }),
        ],
        [IDL.Nat64],
        ['query'],
      ),
    'get_personality_state' : IDL.Func(
        [TokenIdentifier],
        [PersonalityState],
        ['query'],
      ),
    'get_system_alerts' : IDL.Func([], [IDL.Vec(Alert)], ['query']),
    'get_system_stats' : IDL.Func([], [SystemStats], ['query']),
    'get_user_animas' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : TokenIdentifier,
              'owner' : IDL.Principal,
              'name' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'handle_alert_action' : IDL.Func(
        [AlertAction],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'list_token' : IDL.Func(
        [TokenIdentifier, IDL.Nat64, IDL.Opt(IDL.Nat64)],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
    'verify_payment' : IDL.Func([IDL.Nat64], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
