import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { useAuth } from '../hooks/useAuth';
import { collectionService } from '../services/collectionService';

interface PokemonCardProps {
    id: number;
    name: string;
    imageUrl: string;
}

export function PokemonCard({ id, name, imageUrl }: PokemonCardProps) {
    const navigate = useNavigate();
    const { user, login, register } = useAuth();
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    function handleCardClick() {
        navigate(`/pokemon/${id}`);
    }

    async function handleAddToCollection(e: React.MouseEvent) {
        e.stopPropagation();

        if (!user) {
            setShowAuthModal(true);
            return;
        }

        setAdding(true);
        setMessage('');

        try {
            await collectionService.addPokemon(id, name, imageUrl, undefined);
            setMessage('Added!');
            setTimeout(() => setMessage(''), 2000);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Failed');
            setTimeout(() => setMessage(''), 2000);
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

    return (
        <>
            <div onClick={handleCardClick} className="cursor-pointer">
                <Card className="hover:shadow-2xl transition-all duration-300 group relative">
                    <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="mt-3">
                        <p className="text-xs font-bold text-pokemon-orange bg-pokemon-orange/10 inline-block px-2 py-1 rounded">
                            #{String(id).padStart(3, '0')}
                        </p>
                        <h3 className="text-lg font-bold capitalize text-gray-800 mt-2 group-hover:text-pokemon-red transition-colors">
                            {name}
                        </h3>
                    </div>
                    
                    <Button
                        onClick={handleAddToCollection}
                        disabled={adding}
                        className="mt-3 w-full text-sm"
                        variant="secondary"
                    >
                        {adding ? 'Adding...' : 'Add to Collection'}
                    </Button>
                    
                    {message && (
                        <p className={`text-xs mt-2 text-center ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}
                </Card>
            </div>

            {showAuthModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
                    onClick={() => setShowAuthModal(false)}
                >
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
        </>
    );
}
