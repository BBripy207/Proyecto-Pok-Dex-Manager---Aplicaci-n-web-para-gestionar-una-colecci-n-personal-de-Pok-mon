import { useState, useEffect } from 'react';
import { Container } from '../components/Container';
import { PokemonCard } from '../components/PokemonCard';
import { Button } from '../components/Button';
import { pokemonService } from '../services/pokemonService';
import type { PokemonListItem } from '../types';

export function PokemonListPage() {
    const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const limit = 20;

    useEffect(() => {
        loadPokemon();
    }, [offset]);

    async function loadPokemon() {
        setLoading(true);
        try {
            const data = await pokemonService.getList(limit, offset);
            setPokemon(data.results);
        } catch (error) {
            console.error('Failed to load pokemon');
        } finally {
            setLoading(false);
        }
    }

    function handlePrevious() {
        if (offset >= limit) {
            setOffset(offset - limit);
        }
    }

    function handleNext() {
        setOffset(offset + limit);
    }

    function extractIdFromUrl(url: string): number {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 2]);
    }

    if (loading) {
        return (
            <Container>
                <div className="text-center py-20 text-white text-xl">Loading...</div>
            </Container>
        );
    }

    return (
        <Container>
            <h1 className="text-4xl font-bold mb-8 text-white">Pokémon</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pokemon.map((p) => {
                    const id = extractIdFromUrl(p.url);
                    return (
                        <PokemonCard
                            key={id}
                            id={id}
                            name={p.name}
                            imageUrl={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                        />
                    );
                })}
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <Button onClick={handlePrevious} disabled={offset === 0}>
                    Previous
                </Button>
                <Button onClick={handleNext}>
                    Next
                </Button>
            </div>
        </Container>
    );
}
