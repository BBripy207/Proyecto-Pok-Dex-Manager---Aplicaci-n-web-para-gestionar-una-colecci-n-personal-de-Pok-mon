import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { pokemonService } from '../services/pokemonService';
import { collectionService } from '../services/collectionService';
import type { Pokemon } from '../types';

export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

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

  if (loading) {
    return (
      <Container>
        <div className="text-center py-20">Loading...</div>
      </Container>
    );
  }

  if (!pokemon) {
    return (
      <Container>
        <div className="text-center py-20">Pokemon not found</div>
      </Container>
    );
  }

  return (
    <Container>
      <Button onClick={() => navigate('/pokemon')} className="mb-6">
        Back to List
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
            className="w-full"
          />
        </Card>

        <div className="space-y-6">
          <div>
            <p className="text-gray-500">#{pokemon.id}</p>
            <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
          </div>

          <Card>
            <h2 className="text-xl font-semibold mb-2">Types</h2>
            <div className="flex gap-2">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="px-3 py-1 bg-pokemon-blue text-white rounded-full text-sm capitalize"
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-2">Stats</h2>
            <p>Height: {pokemon.height / 10} m</p>
            <p>Weight: {pokemon.weight / 10} kg</p>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Add to Collection</h2>
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
    </Container>
  );
}
