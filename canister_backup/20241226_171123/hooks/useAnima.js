import { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { createActor } from '@/declarations/anima';
import { CANISTER_IDS } from '@/config';

export function useAnima() {
  const [anima, setAnima] = useState(null);
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initActor = async () => {
      try {
        const actor = createActor(CANISTER_IDS.anima);
        setActor(actor);
        await refreshAnimaState(actor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initActor();
  }, []);

  async function refreshAnimaState(actor) {
    try {
      const response = await actor.get_user_state([]);
      if ('Initialized' in response) {
        const animaData = await actor.get_anima(response.Initialized.anima_id);
        if ('Ok' in animaData) {
          setAnima(animaData.Ok);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function createAnima(name, icpAmount) {
    if (!actor) return;
    
    setLoading(true);
    try {
      const result = await actor.create_anima(name);
      if ('Ok' in result) {
        await refreshAnimaState(actor);
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function interactWithAnima(message) {
    if (!actor || !anima) return;

    try {
      const result = await actor.interact(Principal.fromText(anima.owner), message);
      if ('Ok' in result) {
        await refreshAnimaState(actor);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function purchaseGrowthPack(type, icpAmount) {
    if (!actor || !anima) return;

    try {
      // Implementation pending - will be added with ICP integration
      console.log('Growth pack purchase:', type, icpAmount);
    } catch (err) {
      setError(err.message);
    }
  }

  async function resurrectAnima(icpAmount) {
    if (!actor || !anima) return;

    try {
      // Implementation pending - will be added with ICP integration
      console.log('Resurrection attempt:', icpAmount);
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    anima,
    loading,
    error,
    createAnima,
    interactWithAnima,
    purchaseGrowthPack,
    resurrectAnima
  };
}