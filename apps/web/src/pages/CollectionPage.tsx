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
        <div className="text-center py-20">Loading...</div>
      </Container>
    );
  }

  if (collection.length === 0) {
    return (
      <Container>
        <h1 className="text-4xl font-bold mb-8">My Collection</h1>
        <Card className="text-center py-12">
          <p className="text-gray-600 mb-4">Your collection is empty</p>
          <Link to="/pokemon">
            <Button>Browse Pokemon</Button>
          </Link>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-4xl font-bold mb-8">
        My Collection ({collection.length})
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collection.map((item) => (
          <Card key={item.id}>
            <Link to={`/pokemon/${item.pokemonId}`}>
              <img
                src={item.spriteUrl}
                alt={item.name}
                className="w-full h-48 object-contain cursor-pointer"
              />
            </Link>
            <div className="mt-4">
              <p className="text-sm text-gray-500">#{item.pokemonId}</p>
              <h3 className="text-lg font-semibold capitalize">{item.name}</h3>
              {item.note && (
                <p className="text-sm text-gray-600 mt-2">{item.note}</p>
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
