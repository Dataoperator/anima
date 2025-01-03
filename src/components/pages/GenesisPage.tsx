// Previous imports remain...

export const GenesisPage: React.FC = () => {
  // Previous state setup...

  const initiateGenesis = async () => {
    if (!name.trim()) {
      setError('Please enter a name for your Anima');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Start genesis animation sequence
      let phase = 0;
      const phaseInterval = setInterval(() => {
        phase++;
        if (phase < GenesisSequence.length) {
          setCurrentPhase(phase);
        }
      }, 2000);

      const actor = createActor();
      
      // First approve ICP transfer
      const ledgerActor = await actor.getLedgerActor();
      await ledgerActor.approve({
        amount: GENESIS_FEE,
        spender: Principal.fromText(process.env.ANIMA_CANISTER_ID || '')
      });

      // Create the Anima
      const result = await actor.create_anima(name);
      
      clearInterval(phaseInterval);
      
      // Changed: Navigate to Anima page first
      navigate(`/anima/${result.toString()}`);
    } catch (err: any) {
      clearInterval(phaseInterval);
      console.error('Genesis failed:', err);
      setError(err.message || 'Failed to create Anima');
    } finally {
      setIsCreating(false);
      setCurrentPhase(0);
    }
  };

  // Rest of component remains the same...
}