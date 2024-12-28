export const idlFactory = ({ IDL }) => {
  const Memory = IDL.Record({
    'emotional_impact' : IDL.Float32,
    'description' : IDL.Text,
    'keywords' : IDL.Vec(IDL.Text),
    'timestamp' : IDL.Nat64,
    'importance_score' : IDL.Float32,
    'event_type' : IDL.Text,
  });
  const InteractionResult = IDL.Record({
    'memory' : Memory,
    'personality_updates' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float32)),
    'is_autonomous' : IDL.Bool,
    'response' : IDL.Text,
  });
  const NFTPersonality = IDL.Record({
    'interaction_count' : IDL.Nat32,
    'traits' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float32)),
    'memories' : IDL.Vec(Memory),
  });
  const AnimaNFT = IDL.Record({
    'listing_price' : IDL.Opt(IDL.Nat64),
    'creation_time' : IDL.Nat64,
    'personality' : NFTPersonality,
    'token_id' : IDL.Nat64,
    'last_interaction' : IDL.Nat64,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'level' : IDL.Nat32,
    'traits_locked' : IDL.Bool,
    'autonomous_enabled' : IDL.Bool,
    'growth_points' : IDL.Nat32,
    'approved_address' : IDL.Opt(IDL.Principal),
  });
  const UserState = IDL.Variant({
    'Initialized' : IDL.Record({
      'name' : IDL.Text,
      'anima_id' : IDL.Principal,
    }),
    'NotInitialized' : IDL.Null,
  });
  const Error = IDL.Variant({
    'Configuration' : IDL.Text,
    'PaymentFailed' : IDL.Null,
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'InvalidToken' : IDL.Null,
    'AlreadyInitialized' : IDL.Null,
    'External' : IDL.Text,
    'TransferFailed' : IDL.Null,
  });
  const InteractionResponse = IDL.Variant({
    'Ok' : InteractionResult,
    'Err' : Error,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : Error });
  return IDL.Service({
    'check_initialization' : IDL.Func(
        [IDL.Nat64],
        [IDL.Opt(InteractionResult)],
        ['query'],
      ),
    'get_anima' : IDL.Func([IDL.Nat64], [IDL.Opt(AnimaNFT)], ['query']),
    'get_user_state' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [UserState],
        ['query'],
      ),
    'icrc7_name' : IDL.Func([], [IDL.Text], ['query']),
    'interact' : IDL.Func([IDL.Nat64, IDL.Text], [InteractionResponse], []),
    'mint_anima' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
