import { CollectionRepository } from '../repositories/CollectionRepository';

export const CollectionService = {
  async getByUser(userId: number) {
    return CollectionRepository.getByUser(userId);
  },

  async addPokemon(userId: number, pokemonId: number, name: string, spriteUrl: string, note?: string) {
    const existing = await CollectionRepository.findByPokemonAndUser(pokemonId, userId);
    if (existing) {
      throw new Error('Pokemon already in collection');
    }

    return CollectionRepository.create(pokemonId, name, spriteUrl, userId, note);
  },

  async removePokemon(userId: number, itemId: number) {
    const result = await CollectionRepository.delete(itemId, userId);
    if (result.count === 0) {
      throw new Error('Item not found or unauthorized');
    }
    return result;
  },

  async getStats(userId: number) {
    const count = await CollectionRepository.count(userId);
    return { totalCount: count };
  },
};
