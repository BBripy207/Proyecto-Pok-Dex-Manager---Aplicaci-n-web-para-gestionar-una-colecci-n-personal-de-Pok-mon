import type { Pokemon, PokemonListResponse } from '../types';

const POKEAPI_URL = 'https://pokeapi.co/api/v2';

export const pokemonService = {
    async getList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
        const response = await fetch(`${POKEAPI_URL}/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error('Failed to fetch pokemon list');
        return response.json();
    },

    async getById(id: number): Promise<Pokemon> {
        const response = await fetch(`${POKEAPI_URL}/pokemon/${id}`);
        if (!response.ok) throw new Error('Failed to fetch pokemon');
        return response.json();
    },

    async getByName(name: string): Promise<Pokemon> {
        const response = await fetch(`${POKEAPI_URL}/pokemon/${name}`);
        if (!response.ok) throw new Error('Failed to fetch pokemon');
        return response.json();
    },
};
