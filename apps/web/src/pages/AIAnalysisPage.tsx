import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PokemonCard } from '../components/PokemonCard';
import { aiService } from '../services/aiService';
import { pokemonService } from '../services/pokemonService';
import { collectionService } from '../services/collectionService';
import type { Pokemon } from '../types';

export function AIAnalysisPage() {
    const [recommendations, setRecommendations] = useState<string>('');
    const [recommendedPokemon, setRecommendedPokemon] = useState<Pokemon[]>([]);
    const [collectionIds, setCollectionIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const loadCollection = async () => {
        try {
            const collection = await collectionService.getCollection();
            setCollectionIds(new Set(collection.map(item => item.pokemonId)));
        } catch {
            // Usuario no autenticado o error
            setCollectionIds(new Set());
        }
    };

    useEffect(() => {
        loadCollection();
    }, []);

    const extractPokemonNames = (text: string): string[] => {
        // Extraer nombres de Pokémon de la respuesta (busca **NombrePokemon**)
        const pokemonNamesSet = new Set<string>();
        const lines = text.split('\n');

        for (const line of lines) {
            // Buscar patrones como **Charizard** o **Mega Charizard**
            const match = line.match(/^\*\*([A-Z][a-z]+(?:-[A-Z][a-z]+)?)\*\*/);
            if (match && match[1]) {
                const pokemonName = match[1].toLowerCase().trim();
                if (pokemonName.length > 2) {
                    pokemonNamesSet.add(pokemonName);
                }
            }
        }

        return Array.from(pokemonNamesSet).slice(0, 5); // Máximo 5, sin duplicados
    };

    const fetchPokemonCards = async (names: string[]) => {
        const pokemonPromises = names.map(async (name) => {
            try {
                return await pokemonService.getByName(name);
            } catch {
                return null;
            }
        });

        const results = await Promise.all(pokemonPromises);
        return results.filter((p: Pokemon | null): p is Pokemon => p !== null);
    };

    const handleGetRecommendations = async () => {
        setLoading(true);
        setError('');
        setRecommendations('');
        setRecommendedPokemon([]);

        try {
            const response = await aiService.getRecommendations();
            if (response.success) {
                setRecommendations(response.recommendations);

                // Extraer nombres y buscar Pokémon
                const names = extractPokemonNames(response.recommendations);
                if (names.length > 0) {
                    const pokemon = await fetchPokemonCards(names);
                    setRecommendedPokemon(pokemon);
                }
            } else {
                setError('No se pudo generar recomendaciones. Asegúrate de tener Pokémon en tu colección.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al generar recomendaciones');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Team Builder</h1>
                </div>

                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Encuentra el Pokémon Perfecto
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Descubre qué Pokémon complementan tu equipo actual y aprende estrategias
                            para combinarlos efectivamente en batalla.
                        </p>

                        <Button
                            onClick={handleGetRecommendations}
                            disabled={loading}
                            className="w-full sm:w-auto"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analizando tu equipo...
                                </>
                            ) : (
                                <>
                                    ¡Arma tu equipo!
                                </>
                            )}
                        </Button>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {recommendations && (
                            <>
                                <div className="mt-6 p-6 bg-gradient-to-br from-pokemon-cream to-pokemon-cream-dark/30 border-2 border-pokemon-orange rounded-lg">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Sugerencias para tu Equipo
                                        </h3>
                                    </div>
                                    <div className="max-w-none text-gray-700"
                                        dangerouslySetInnerHTML={{
                                            __html: recommendations
                                                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-lg block mt-4 mb-2 text-pokemon-red">$1</strong>')
                                                .replace(/\n/g, '<br />')
                                        }}
                                    />
                                </div>

                                {recommendedPokemon.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Pokémon Recomendados
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {recommendedPokemon.map((pokemon) => (
                                                <PokemonCard
                                                    key={pokemon.id}
                                                    id={pokemon.id}
                                                    name={pokemon.name}
                                                    imageUrl={pokemon.sprites.front_default}
                                                    isInCollection={collectionIds.has(pokemon.id)}
                                                    onAdded={loadCollection}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </Container>
    );
}
