export const idlFactory = ({ IDL }) => {
  const EventType = IDL.Variant({
    'LearningMoment' : IDL.Null,
    'AutonomousThought' : IDL.Null,
    'EmotionalResponse' : IDL.Null,
    'UserInteraction' : IDL.Null,
    'RelationshipDevelopment' : IDL.Null,
  });
  const Memory = IDL.Record({
    'emotional_impact' : IDL.Float32,
    'description' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'event_type' : EventType,
  });
  const InteractionResult = IDL.Record({
    'memory' : Memory,
    'personality_updates' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float32)),
    'is_autonomous' : IDL.Bool,
    'response' : IDL.Text,
  });
  const Error = IDL.Variant({
    'Configuration' : IDL.Text,
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'External' : IDL.Text,
  });
  const DevelopmentalStage = IDL.Variant({
    'Beginner' : IDL.Null,
    'Advanced' : IDL.Null,
    'Initial' : IDL.Null,
    'Intermediate' : IDL.Null,
    'Expert' : IDL.Null,
  });
  const NFTPersonality = IDL.Record({
    'creation_time' : IDL.Nat64,
    'interaction_count' : IDL.Nat64,
    'hash' : IDL.Opt(IDL.Text),
    'traits' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float32)),
    'growth_level' : IDL.Nat32,
    'memories' : IDL.Vec(Memory),
    'developmental_stage' : DevelopmentalStage,
  });
  const Anima = IDL.Record({
    'creation_time' : IDL.Nat64,
    'personality' : NFTPersonality,
    'last_interaction' : IDL.Nat64,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'autonomous_enabled' : IDL.Bool,
  });
  return IDL.Service({
    'check_autonomous_messages' : IDL.Func(
        [IDL.Principal],
        [IDL.Variant({ 'Ok' : IDL.Opt(InteractionResult), 'Err' : Error })],
        [],
      ),
    'create_anima' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : Error })],
        [],
      ),
    'get_anima' : IDL.Func(
        [IDL.Principal],
        [IDL.Variant({ 'Ok' : Anima, 'Err' : Error })],
        ['query'],
      ),
    'interact' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [IDL.Variant({ 'Ok' : InteractionResult, 'Err' : Error })],
        [],
      ),
    'set_openai_api_key' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : Error })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
