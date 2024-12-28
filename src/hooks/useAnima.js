import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import { createActor } from '@/declarations/anima';
import { CANISTER_IDS } from '@/config';
import { requestManager, withErrorHandling } from '@/utils/requestManager';
import { debounce } from 'lodash';

export function useAnima() {
  const [anima, setAnima] = useState(null);
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const refreshAnimaState = useCallback(async (actorInstance) => {
    return withErrorHandling(async () => {
      const targetActor = actorInstance || actor;
      if (!targetActor) return;

      const [userState, animaData] = await requestManager.batchRequests([
        ['get_user_state', () => targetActor.get_user_state([])],
        ['get_anima', () => {
          if ('Initialized' in userState) {
            return targetActor.get_anima(userState.Initialized.anima_id);
          }
          return null;
        }]
      ]);

      if ('Initialized' in userState && animaData && 'Ok' in animaData) {
        setAnima(animaData.Ok);
      }
    });
  }, [actor]);

  // Debounced refresh to prevent too frequent updates
  const debouncedRefresh = useCallback(
    debounce(refreshAnimaState, 2000, { leading: true, trailing: true }),
    [refreshAnimaState]
  );

  useEffect(() => {
    const initActor = async () => {
      try {
        const newActor = createActor(CANISTER_IDS.anima);
        setActor(newActor);
        await refreshAnimaState(newActor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initActor();

    // Set up periodic refresh with increasing intervals
    let interval = 2000;
    let maxInterval = 30000;
    let timeoutId;

    const scheduleNextRefresh = () => {
      timeoutId = setTimeout(() => {
        debouncedRefresh();
        interval = Math.min(interval * 1.5, maxInterval);
        scheduleNextRefresh();
      }, interval);
    };

    scheduleNextRefresh();

    return () => {
      clearTimeout(timeoutId);
      debouncedRefresh.cancel();
    };
  }, [debouncedRefresh]);

  const createAnima = async (name, icpAmount) => {
    if (!actor) return;
    
    setLoading(true);
    try {
      const result = await requestManager.enqueueRequest(
        'create_anima',
        () => actor.create_anima(name)
      );
      
      if ('Ok' in result) {
        await debouncedRefresh();
        setLastUpdate(Date.now());
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const interactWithAnima = async (message) => {
    if (!actor || !anima) return;

    try {
      const result = await requestManager.enqueueRequest(
        'interact',
        () => actor.interact(Principal.fromText(anima.owner), message)
      );

      if ('Ok' in result) {
        await debouncedRefresh();
        setLastUpdate(Date.now());
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const purchaseGrowthPack = async (type, icpAmount) => {
    if (!actor || !anima) return;

    try {
      await requestManager.enqueueRequest(
        'purchase_growth_pack',
        () => actor.purchase_growth_pack(type, icpAmount)
      );
      await debouncedRefresh();
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err.message);
    }
  };

  const resurrectAnima = async (icpAmount) => {
    if (!actor || !anima) return;

    try {
      await requestManager.enqueueRequest(
        'resurrect_anima',
        () => actor.resurrect_anima(icpAmount)
      );
      await debouncedRefresh();
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    anima,
    loading,
    error,
    lastUpdate,
    createAnima,
    interactWithAnima,
    purchaseGrowthPack,
    resurrectAnima,
    refreshState: debouncedRefresh
  };
}