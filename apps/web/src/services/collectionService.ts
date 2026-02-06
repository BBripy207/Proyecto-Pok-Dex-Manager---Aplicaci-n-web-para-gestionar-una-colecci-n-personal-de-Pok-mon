import type { CollectionItem } from '../types';

const API_URL = 'http://localhost:3000/api';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const collectionService = {
  async getCollection(): Promise<CollectionItem[]> {
    return fetchAPI('/collection');
  },

  async addPokemon(pokemonId: number, name: string, spriteUrl: string, note?: string): Promise<CollectionItem> {
    return fetchAPI('/collection', {
      method: 'POST',
      body: JSON.stringify({ pokemonId, name, spriteUrl, note }),
    });
  },

  async removePokemon(itemId: number): Promise<void> {
    return fetchAPI(`/collection/${itemId}`, {
      method: 'DELETE',
    });
  },

  async getStats() {
    return fetchAPI('/collection/stats');
  },
};
