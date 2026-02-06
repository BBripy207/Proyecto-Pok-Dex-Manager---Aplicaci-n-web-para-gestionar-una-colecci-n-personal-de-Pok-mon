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
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="mt-3">
                    <p className="text-xs font-bold text-pokemon-orange bg-pokemon-orange/10 inline-block px-2 py-1 rounded">#{String(id).padStart(3, '0')}</p>
                    <h3 className="text-lg font-bold capitalize text-gray-800 mt-2 group-hover:text-pokemon-red transition-colors">{name}</h3>
                </div>
            </Card>
        </Link>
    );
}
