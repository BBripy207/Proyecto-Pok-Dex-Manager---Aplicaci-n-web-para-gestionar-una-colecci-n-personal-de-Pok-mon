import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/AuthService';

const router = Router();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const result = await AuthService.register(email, password);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user: result.user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const result = await AuthService.login(email, password);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: result.user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.post('/logout', (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

export default router;
