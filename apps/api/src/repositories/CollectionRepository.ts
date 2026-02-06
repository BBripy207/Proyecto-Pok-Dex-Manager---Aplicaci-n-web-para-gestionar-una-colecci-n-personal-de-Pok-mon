import { prisma } from '../lib/prisma';

export const CollectionRepository = {
  async getByUser(userId: number) {
    return prisma.collectionItem.findMany({
      where: { userId },
      orderBy: { pokemonId: 'asc' },
    });
  },

  async findByPokemonAndUser(pokemonId: number, userId: number) {
    return prisma.collectionItem.findFirst({
      where: { pokemonId, userId },
    });
  },

  async create(pokemonId: number, name: string, spriteUrl: string, userId: number, note?: string) {
    return prisma.collectionItem.create({
      data: { pokemonId, name, spriteUrl, userId, note },
    });
  },

  async delete(id: number, userId: number) {
    return prisma.collectionItem.deleteMany({
      where: { id, userId },
    });
  },

  async count(userId: number) {
    return prisma.collectionItem.count({ where: { userId } });
  },
};
