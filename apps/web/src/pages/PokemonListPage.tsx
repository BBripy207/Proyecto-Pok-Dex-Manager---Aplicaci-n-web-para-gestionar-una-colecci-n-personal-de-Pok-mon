import { useState, useEffect } from 'react';
import { Container } from '../components/Container';
import { PokemonCard } from '../components/PokemonCard';
import { Button } from '../components/Button';
import { pokemonService } from '../services/pokemonService';
import type { PokemonListItem } from '../types';
import pokeball from '../assets/Poké_Ball_icon.svg.png';

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
                <div className="text-center py-10 text-white text-xl">Loading...</div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="text-center py-6 mb-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <img src={pokeball} alt="Pokeball" className="w-16 h-16 animate-spin-slow" />
                    <h1 className="text-6xl font-extrabold text-white drop-shadow-lg">
                        <span className="text-pokemon-yellow">Poké</span><span className="text-pokemon-red">Dex</span> <span className="text-white">Manager</span>
                    </h1>
                    <img src={pokeball} alt="Pokeball" className="w-16 h-16 animate-spin-slow" />
                </div>
                
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

            <div className="flex justify-center gap-4 mt-6">
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
