import { Router, Response, Request } from 'express';
import { AIService } from '../services/AIService';
import { CollectionService } from '../services/CollectionService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const aiService = new AIService();

// Endpoint de prueba SIN autenticación (debe ir ANTES del middleware)
router.get('/test-public', async (req: Request, res: Response): Promise<void> => {
    try {
        const testPokemon = {
            id: 25,
            name: 'Pikachu',
            types: ['electric'],
            abilities: ['static', 'lightning-rod'],
            stats: {
                hp: 35,
                attack: 55,
                defense: 40,
                specialAttack: 50,
                specialDefense: 50,
                speed: 90
            }
        };

        const facts = await aiService.generatePokemonFacts(testPokemon);
        res.json({ success: true, facts });
    } catch (error) {
        console.error('Error en AI test:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
});

// Ahora aplicamos autenticación para el resto de endpoints
router.use(authenticate);

// Generar recomendaciones basadas en tu colección
router.get('/recommendations', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const collection = await CollectionService.getByUser(req.userId!);

        if (collection.length === 0) {
            res.json({ success: false, message: 'No tienes Pokémon en tu colección' });
            return;
        }

        // Mapear la colección al formato que espera AIService
        const collectionForAI = collection.map(item => ({
            id: item.pokemonId,
            name: item.name,
            types: [], // No tenemos tipos en la DB actual
            abilities: [],
            stats: {
                hp: 0,
                attack: 0,
                defense: 0,
                specialAttack: 0,
                specialDefense: 0,
                speed: 0
            },
            addedAt: item.addedAt,
            notes: item.note || undefined
        }));

        const recommendations = await aiService.generateRecommendations(collectionForAI);
        res.json({ success: true, recommendations, totalPokemon: collection.length });
    } catch (error) {
        console.error('Error generando recomendaciones:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
});

// Endpoint de prueba CON autenticación
router.get('/test', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const testPokemon = {
            id: 25,
            name: 'Pikachu',
            types: ['electric'],
            abilities: ['static', 'lightning-rod'],
            stats: {
                hp: 35,
                attack: 55,
                defense: 40,
                specialAttack: 50,
                specialDefense: 50,
                speed: 90
            }
        };

        const facts = await aiService.generatePokemonFacts(testPokemon);
        res.json({ success: true, facts });
    } catch (error) {
        console.error('Error en AI test:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
});

export default router;
