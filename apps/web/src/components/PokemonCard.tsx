import { Link } from 'react-router-dom';
import { Card } from './Card';

interface PokemonCardProps {
  id: number;
  name: string;
  imageUrl: string;
}

export function PokemonCard({ id, name, imageUrl }: PokemonCardProps) {
  return (
    <Link to={`/pokemon/${id}`}>
      <Card className="hover:shadow-xl transition-shadow cursor-pointer">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-contain"
        />
        <div className="mt-4">
          <p className="text-sm text-gray-500">#{id}</p>
          <h3 className="text-lg font-semibold capitalize">{name}</h3>
        </div>
      </Card>
    </Link>
  );
}
