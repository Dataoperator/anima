export const REQUIRED_METHODS = [
  'get_user_state',
  'initiate_payment',
  'complete_payment',
  'mint_anima',
  'get_anima',
  'interact'
];

export const checkActorMethods = (actor) => {
  const missingMethods = REQUIRED_METHODS.filter(method => !(method in actor));
  return {
    valid: missingMethods.length === 0,
    missingMethods
  };
};

export const getActorMethodStatus = async (actor) => {
  if (!actor) {
    return {
      success: false,
      error: 'No actor provided'
    };
  }

  // First check if all required methods exist
  const methodCheck = checkActorMethods(actor);
  if (!methodCheck.valid) {
    return {
      success: false,
      error: `Missing required methods: ${methodCheck.missingMethods.join(', ')}`
    };
  }

  try {
    // Try a simple query call to verify connectivity
    await actor.icrc7_name();
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to verify actor: ${error.message}`
    };
  }
};