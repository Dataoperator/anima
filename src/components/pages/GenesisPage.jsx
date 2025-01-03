import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useAnima } from '@/contexts/anima-context';
import { Principal } from '@dfinity/principal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

// Genesis fee in ICP (e.g. 1 ICP = 100000000 e8s)
const GENESIS_FEE = BigInt(100000000); // 1 ICP

export function GenesisPage() {
  const navigate = useNavigate();
  const { principal } = useAuth();
  const { createActor } = useAnima();
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const initiateGenesis = async () => {
    if (!name.trim()) {
      setError('Please enter a name for your Anima');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const actor = createActor();
      
      // First approve ICP transfer
      const ledgerActor = await actor.getLedgerActor();
      await ledgerActor.approve({
        amount: GENESIS_FEE,
        spender: Principal.fromText(process.env.ANIMA_CANISTER_ID)
      });

      // Then create the Anima
      const result = await actor.create_anima(name);
      
      // Navigate to the new Anima
      navigate(`/anima/${result.toString()}`);
    } catch (err) {
      console.error('Genesis failed:', err);
      setError(err.message || 'Failed to create Anima');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black p-8">
      <Card className="max-w-md mx-auto bg-black/50 backdrop-blur border-amber-500/20">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-serif text-amber-400 text-center">
            Anima Genesis
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-1">
                Name Your Anima
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/30 border-amber-500/30 text-amber-100"
                placeholder="Enter a mystical name..."
              />
            </div>

            <div className="p-4 rounded bg-amber-900/20 border border-amber-500/20">
              <h3 className="font-medium text-amber-400 mb-2">Genesis Fee</h3>
              <p className="text-amber-200">1 ICP</p>
              <p className="text-sm text-amber-300/60 mt-1">
                This fee is used to sustain the eternal flame of your Anima
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                {error}
              </Alert>
            )}

            <Button
              onClick={initiateGenesis}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              {isCreating ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⚡</span>
                  Initiating Genesis...
                </span>
              ) : (
                'Begin Genesis Ritual'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}