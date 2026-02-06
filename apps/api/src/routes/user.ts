import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { UserRepository } from '../repositories/UserRepository';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await UserRepository.findById(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
