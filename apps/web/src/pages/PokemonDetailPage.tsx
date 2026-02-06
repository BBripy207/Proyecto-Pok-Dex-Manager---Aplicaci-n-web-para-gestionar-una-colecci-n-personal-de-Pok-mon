import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { pokemonService } from '../services/pokemonService';
import { collectionService } from '../services/collectionService';
import { useAuth } from '../hooks/useAuth';
import type { Pokemon } from '../types';

export function PokemonDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, login, register } = useAuth();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        loadPokemon();
    }, [id]);

    async function loadPokemon() {
        if (!id) return;
        setLoading(true);
        try {
            const data = await pokemonService.getById(parseInt(id));
            setPokemon(data);
        } catch (error) {
            console.error('Failed to load pokemon');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddToCollection(e: FormEvent) {
        e.preventDefault();
        if (!pokemon) return;

        if (!user) {
            setShowAuthModal(true);
            return;
        }

        setAdding(true);
        setMessage('');

        try {
            await collectionService.addPokemon(
                pokemon.id,
                pokemon.name,
                pokemon.sprites.other['official-artwork'].front_default,
                note || undefined
            );
            setMessage('Added to collection!');
            setNote('');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Failed to add');
        } finally {
            setAdding(false);
        }
    }

    async function handleAuth(e: FormEvent) {
        e.preventDefault();
        setAuthError('');

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
            setShowAuthModal(false);
            setEmail('');
            setPassword('');
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'Authentication failed');
        }
    }

    if (loading) {
        return (
            <Container>
                <div className="text-center py-10 text-white text-xl">Loading...</div>
            </Container>
        );
    }

    if (!pokemon) {
        return (
            <Container>
                <div className="text-center py-10 text-white text-xl">Pokemon not found</div>
            </Container>
        );
    }

    return (
        <Container>
            <Button onClick={() => navigate('/')} className="mb-6">
                Back to List
            </Button>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full">
                        <img
                            src={pokemon.sprites.other['official-artwork'].front_default}
                            alt={pokemon.name}
                            className="w-full hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </Card>

                <div className="space-y-4">
                    <div>
                        <p className="text-pokemon-orange font-bold text-lg">#{String(pokemon.id).padStart(3, '0')}</p>
                        <h1 className="text-4xl font-bold capitalize text-white">{pokemon.name}</h1>
                    </div>

                    <Card>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">Types</h2>
                        <div className="flex gap-2">
                            {pokemon.types.map((t) => (
                                <span
                                    key={t.type.name}
                                    className="px-4 py-2 bg-pokemon-red text-white rounded-lg text-sm capitalize font-bold shadow-md"
                                >
                                    {t.type.name}
                                </span>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">Stats</h2>
                        <div className="space-y-2 text-gray-700">
                            <p className="font-medium">Height: <span className="font-bold text-gray-800">{pokemon.height / 10} m</span></p>
                            <p className="font-medium">Weight: <span className="font-bold text-gray-800">{pokemon.weight / 10} kg</span></p>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add to Collection</h2>
                        <form onSubmit={handleAddToCollection} className="space-y-4">
                            <Input
                                label="Note (optional)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add a personal note..."
                            />
                            <Button type="submit" fullWidth disabled={adding}>
                                {adding ? 'Adding...' : 'Add to Collection'}
                            </Button>
                            {message && (
                                <p className={`text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </Card>
                </div>
            </div>

            {showAuthModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAuthModal(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Card className="w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                {isLogin ? 'Login to Add Pokemon' : 'Create Account'}
                            </h2>
                            <form onSubmit={handleAuth} className="space-y-4">
                                <Input
                                    type="email"
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    type="password"
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {authError && <p className="text-sm text-red-600">{authError}</p>}
                                <Button type="submit" fullWidth>
                                    {isLogin ? 'Login' : 'Register'}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
                                >
                                    {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                                </button>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </Container>
    );
}
