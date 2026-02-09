import { useState, useEffect } from 'react';
import { Container } from '../components/Container';
import { PokemonCard } from '../components/PokemonCard';
import { Button } from '../components/Button';
import { pokemonService } from '../services/pokemonService';
import { collectionService } from '../services/collectionService';
import { useAuth } from '../hooks/useAuth';
import type { PokemonListItem } from '../types';
import pokeball from '../assets/Poké_Ball_icon.svg.png';

export function PokemonListPage() {
    const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [collectionIds, setCollectionIds] = useState<Set<number>>(new Set());
    const { user } = useAuth();
    const limit = 20;

    useEffect(() => {
        loadPokemon();
        if (user) {
            loadCollection();
        }
    }, [offset, user]);

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

    async function loadCollection() {
        try {
            const collection = await collectionService.getCollection();
            const ids = new Set(collection.map(item => item.pokemonId));
            setCollectionIds(ids);
        } catch (error) {
            console.error('Failed to load collection');
        }
    }

    function showMessage(msg: string) {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    }

    function onPokemonAdded(pokemonId: number) {
        setCollectionIds(prev => new Set([...prev, pokemonId]));
        showMessage('✓ Added to collection!');
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

    const filteredPokemon = pokemon.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Container>
                <div className="text-center py-10 text-white text-xl">Loading...</div>
            </Container>
        );
    }

    return (
        <Container>
            {message && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
                    {message}
                </div>
            )}

            <div className="text-center py-6 mb-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <img src={pokeball} alt="Pokeball" className="w-16 h-16 animate-spin-slow" />
                    <h1 className="text-6xl font-extrabold text-white drop-shadow-lg">
                        <span className="text-pokemon-yellow">Poké</span><span className="text-pokemon-red">Dex</span> <span className="text-white">Manager</span>
                    </h1>
                    <img src={pokeball} alt="Pokeball" className="w-16 h-16 animate-spin-slow" />
                </div>

                <div className="max-w-lg mx-auto mt-4">
                    <input
                        type="text"
                        placeholder="Search Pokémon by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-2 bg-white/90 backdrop-blur-sm border border-pokemon-cream-dark/30 rounded-full text-center text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pokemon-orange/50 focus:border-pokemon-orange shadow-lg transition-all"
                    />
                </div>
            </div>

            {filteredPokemon.length === 0 ? (
                <div className="text-center py-10 text-white text-xl">
                    No Pokémon found matching "{searchTerm}"
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPokemon.map((p) => {
                        const id = extractIdFromUrl(p.url);
                        return (
                            <PokemonCard
                                key={id}
                                id={id}
                                name={p.name}
                                imageUrl={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                                isInCollection={collectionIds.has(id)}
                                onAdded={() => onPokemonAdded(id)}
                            />
                        );
                    })}
                </div>
            )}

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
