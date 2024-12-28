export const idlFactory = ({ IDL }) => {
  const Error = IDL.Text;
  const TokenIdentifier = IDL.Nat64;
  const NFTPersonality = IDL.Record({
    'traits' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64)),
    'emotional_state' : IDL.Record({
      'duration' : IDL.Nat64,
      'current_emotion' : IDL.Text,
      'intensity' : IDL.Float64,
    }),
    'memories' : IDL.Vec(
      IDL.Record({
        'emotional_impact' : IDL.Float64,
        'content' : IDL.Text,
        'timestamp' : IDL.Nat64,
      })
    ),
    'developmental_stage' : IDL.Variant({
      'SelfAware' : IDL.Null,
      'Awakening' : IDL.Null,
      'Conscious' : IDL.Null,
      'Transcendent' : IDL.Null,
      'Nascent' : IDL.Null,
    }),
  });
  const MetadataAttribute = IDL.Record({
    'trait_type' : IDL.Text,
    'value' : IDL.Text,
  });
  const TokenMetadata = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
    'attributes' : IDL.Vec(MetadataAttribute),
    'image' : IDL.Opt(IDL.Text),
  });
  const InteractionRecord = IDL.Record({
    'message' : IDL.Text,
    'timestamp' : IDL.Nat64,
  });
  const AnimaToken = IDL.Record({
    'id' : TokenIdentifier,
    'creation_time' : IDL.Nat64,
    'personality' : NFTPersonality,
    'last_interaction' : IDL.Nat64,
    'owner' : IDL.Principal,
    'metadata' : IDL.Opt(TokenMetadata),
    'interaction_history' : IDL.Vec(InteractionRecord),
    'name' : IDL.Text,
    'level' : IDL.Nat32,
    'growth_points' : IDL.Nat64,
    'autonomous_mode' : IDL.Bool,
  });
  return IDL.Service({
    'create_anima' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : Error })],
        [],
      ),
    'get_anima' : IDL.Func([TokenIdentifier], [IDL.Opt(AnimaToken)], ['query']),
    'get_user_animas' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(AnimaToken)],
        ['query'],
      ),
    'transfer_anima' : IDL.Func(
        [IDL.Principal, TokenIdentifier],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : Error })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
