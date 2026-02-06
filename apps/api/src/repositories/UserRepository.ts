import { prisma } from '../lib/prisma';

export const UserRepository = {
  async create(email: string, hashedPassword: string) {
    return prisma.user.create({
      data: { email, password: hashedPassword },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },
};
