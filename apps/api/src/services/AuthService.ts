import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { generateToken } from '../lib/jwt';

export const AuthService = {
  async register(email: string, password: string) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserRepository.create(email, hashedPassword);

    const token = generateToken(user.id);
    return { user: { id: user.id, email: user.email }, token };
  },

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);
    return { user: { id: user.id, email: user.email }, token };
  },
};
