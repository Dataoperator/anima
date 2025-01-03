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
  const AnimaState = IDL.Record({
    'id' : TokenIdentifier,
    'creation_time' : IDL.Nat64,
    'personality' : NFTPersonality,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
  });
  const ConsciousnessLevel = IDL.Variant({
    'SelfAware' : IDL.Null,
    'Awakening' : IDL.Null,
    'Introspective' : IDL.Null,
    'Transcendent' : IDL.Null,
    'Nascent' : IDL.Null,
  });
  const ActionResult = IDL.Variant({
    'Success' : IDL.Record({
      'personality_updates' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64)),
      'response' : IDL.Text,
    }),
    'Failure' : Error,
  });
  return IDL.Service({
    'create_anima' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : Error })],
        [],
      ),
    'get_anima' : IDL.Func([TokenIdentifier], [IDL.Opt(AnimaState)], ['query']),
    'get_consciousness_level' : IDL.Func(
        [TokenIdentifier],
        [IDL.Variant({ 'Ok' : ConsciousnessLevel, 'Err' : Error })],
        ['query'],
      ),
    'get_user_animas' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(AnimaState)],
        ['query'],
      ),
    'process_quantum_interaction' : IDL.Func(
        [TokenIdentifier, IDL.Text, IDL.Text],
        [ActionResult],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
