import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimaToken } from '@/types/anima';

export const AnimaPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [anima, setAnima] = useState<AnimaToken | null>(null);
    const [loading, setLoading] = useState(true);
    const { actor } = useAuth();

    useEffect(() => {
        const loadAnima = async () => {
            if (!actor || !id) return;
            try {
                const result = await actor.get_anima(BigInt(id));
                if (result) {
                    setAnima(result);
                }
            } catch (error) {
                console.error('Error loading anima:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAnima();
    }, [actor, id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin text-blue-600 text-4xl">⟳</div>
            </div>
        );
    }

    if (!anima) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-xl bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-center text-red-600">
                            Anima not found or you don't have access to it.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card className="bg-black/40 backdrop-blur-lg border border-white/10">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            {anima.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personality Stats */}
                            <Card className="bg-black/20">
                                <CardHeader>
                                    <CardTitle className="text-xl">Personality</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {anima.personality_state && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Growth Level</span>
                                                    <span>{anima.personality_state.growth_level}</span>
                                                </div>
                                                {anima.personality_state.emotional_state && (
                                                    <div className="flex justify-between">
                                                        <span>Current Emotion</span>
                                                        <span>{anima.personality_state.emotional_state.current_emotion}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Consciousness Stats */}
                            <Card className="bg-black/20">
                                <CardHeader>
                                    <CardTitle className="text-xl">Consciousness</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {anima.personality_state?.consciousness && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Awareness Level</span>
                                                <span>
                                                    {(anima.personality_state.consciousness.awareness_level * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Processing Depth</span>
                                                <span>
                                                    {(anima.personality_state.consciousness.processing_depth * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnimaPage;