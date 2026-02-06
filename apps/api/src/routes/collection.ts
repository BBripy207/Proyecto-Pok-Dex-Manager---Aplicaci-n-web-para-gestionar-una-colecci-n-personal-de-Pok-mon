import { Router, Response } from 'express';
import { z } from 'zod';
import { CollectionService } from '../services/CollectionService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

const addPokemonSchema = z.object({
    pokemonId: z.number(),
    name: z.string(),
    spriteUrl: z.string().url(),
    note: z.string().optional(),
});

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const items = await CollectionService.getByUser(req.userId!);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = addPokemonSchema.parse(req.body);
        const item = await CollectionService.addPokemon(
            req.userId!,
            data.pokemonId,
            data.name,
            data.spriteUrl,
            data.note
        );
        res.status(201).json(item);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id));
        await CollectionService.removePokemon(req.userId!, id);
        res.json({ message: 'Pokemon removed' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

router.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const stats = await CollectionService.getStats(req.userId!);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
