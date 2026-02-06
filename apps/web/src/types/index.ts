export interface User {
    id: number;
    email: string;
}

export interface AuthResponse {
    user: User;
}

export interface CollectionItem {
    id: number;
    pokemonId: number;
    name: string;
    spriteUrl: string;
    note?: string;
    userId: number;
}

export interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
    height: number;
    weight: number;
    abilities: Array<{
        ability: {
            name: string;
        };
    }>;
}

export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    results: PokemonListItem[];
    count: number;
    next: string | null;
    previous: string | null;
}
