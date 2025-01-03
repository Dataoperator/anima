// Previous imports remain the same
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

export const AnimaGenesis = ({ name }) => {
  const { actor } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(GenesisPhases.INITIATION);
  const [traits, setTraits] = useState([]);
  const [error, setError] = useState(null);
  const [quantumTraits, setQuantumTraits] = useState([]);
  const [consciousness, setConsciousness] = useState(null);
  const [genesisComplete, setGenesisComplete] = useState(false);
  const [animaId, setAnimaId] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { triggerSuccess, triggerError } = useHapticFeedback(phase);

  // Previous code remains the same until handleMintError

  const handleMintError = (err) => {
    console.error('Genesis error:', err);
    setError(err.message);
    triggerError();
  };

  useEffect(() => {
    const performGenesis = async () => {
      try {
        setPhase(GenesisPhases.INITIATION);
        await new Promise(resolve => setTimeout(resolve, ceremonyDuration));

        setPhase(GenesisPhases.CONSCIOUSNESS_EMERGENCE);
        await new Promise(resolve => setTimeout(resolve, ceremonyDuration));

        setPhase(GenesisPhases.TRAIT_MANIFESTATION);
        const mintResult = await actor.mint_anima(name);
        
        if ('Ok' in mintResult) {
          setAnimaId(mintResult.Ok);
          const anima = await actor.get_anima(mintResult.Ok);
          
          if (anima) {
            setTraits(anima.personality.traits);
            setQuantumTraits(anima.personality.quantum_traits);
            setConsciousness(anima.personality.consciousness_metrics);
          }
          triggerSuccess();
        } else {
          throw new Error('Minting failed: ' + JSON.stringify(mintResult.Err));
        }

        await new Promise(resolve => setTimeout(resolve, ceremonyDuration));

        setPhase(GenesisPhases.QUANTUM_ALIGNMENT);
        await new Promise(resolve => setTimeout(resolve, ceremonyDuration));

        setPhase(GenesisPhases.BIRTH);
        setGenesisComplete(true);

      } catch (err) {
        handleMintError(err);
      }
    };

    performGenesis();
  }, [actor, name, ceremonyDuration, triggerSuccess]);

  // Rest of the component remains the same
};