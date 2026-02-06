import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { collectionService } from '../services/collectionService';
import type { CollectionItem } from '../types';

export function CollectionPage() {
    const [collection, setCollection] = useState<CollectionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCollection();
    }, []);

    async function loadCollection() {
        setLoading(true);
        try {
            const data = await collectionService.getCollection();
            setCollection(data);
        } catch (error) {
            console.error('Failed to load collection');
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove(itemId: number) {
        try {
            await collectionService.removePokemon(itemId);
            setCollection(collection.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error('Failed to remove pokemon');
        }
    }

    if (loading) {
        return (
            <Container>
                <div className="text-center py-20 text-white text-xl">Loading...</div>
            </Container>
        );
    }

    if (collection.length === 0) {
        return (
            <Container>
                <h1 className="text-4xl font-bold mb-8 text-white">My Collection</h1>
                <Card className="text-center py-12">
                    <p className="text-gray-700 mb-4 text-lg">Your collection is empty</p>
                    <Link to="/pokemon">
                        <Button>Browse Pokemon</Button>
                    </Link>
                </Card>
            </Container>
        );
    }

    return (
        <Container>
            <h1 className="text-4xl font-bold mb-8 text-white">
                My Collection ({collection.length})
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {collection.map((item) => (
                    <Card key={item.id}>
                        <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <Link to={`/pokemon/${item.pokemonId}`}>
                                <img
                                    src={item.spriteUrl}
                                    alt={item.name}
                                    className="w-full h-40 object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                                />
                            </Link>
                        </div>
                        <div className="mt-4">
                            <p className="text-xs font-bold text-pokemon-orange bg-pokemon-orange/10 inline-block px-2 py-1 rounded">#{String(item.pokemonId).padStart(3, '0')}</p>
                            <h3 className="text-lg font-bold capitalize mt-2 text-gray-800">{item.name}</h3>
                            {item.note && (
                                <p className="text-sm text-gray-700 mt-2 italic bg-gray-100 p-2 rounded">{item.note}</p>
                            )}
                            <Button
                                variant="danger"
                                fullWidth
                                className="mt-4"
                                onClick={() => handleRemove(item.id)}
                            >
                                Remove
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </Container>
    );
}
