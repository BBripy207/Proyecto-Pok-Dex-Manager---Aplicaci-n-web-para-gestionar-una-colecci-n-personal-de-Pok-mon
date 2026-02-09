import { GoogleGenAI } from '@google/genai';

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    abilities: string[];
    stats: {
        hp: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        speed: number;
    };
}

export interface CollectionPokemon extends Pokemon {
    addedAt: Date;
    notes?: string;
}

export class AIService {
    private ai: GoogleGenAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured');
        }
        this.ai = new GoogleGenAI({ apiKey });
    }

    async generateRecommendations(collection: CollectionPokemon[]): Promise<string> {
        const summary = this.summarizeCollection(collection);
        const stats = this.calculateCollectionStats(collection);

        const prompt = `Eres un experto en Pokémon. Analiza esta colección y genera recomendaciones de qué Pokémon añadir:

Colección actual:
${summary}

Estadísticas:
- Total de Pokémon: ${stats.total}
- Tipos más comunes: ${stats.topTypes.join(', ')}
- Estadística promedio más alta: ${stats.highestAvgStat}

Genera 5 recomendaciones específicas de Pokémon que complementen bien esta colección, explicando por qué cada uno sería una buena adición. Considera balance de tipos y estadísticas.`;

        const response = await this.ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt
        });

        return response.text || '';
    }

    async analyzeCollection(collection: CollectionPokemon[]): Promise<string> {
        const summary = this.summarizeCollection(collection);
        const totalStats = this.getTotalStats(collection);

        const prompt = `Eres un analista experto de Pokémon. Analiza esta colección y proporciona insights detallados:

Colección:
${summary}

Estadísticas totales:
- HP promedio: ${totalStats.avgHp}
- Ataque promedio: ${totalStats.avgAttack}
- Defensa promedio: ${totalStats.avgDefense}
- Velocidad promedio: ${totalStats.avgSpeed}

Proporciona:
1. Fortalezas de la colección
2. Debilidades o áreas de mejora
3. Sinergias entre Pokémon
4. Sugerencias estratégicas`;

        const response = await this.ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt
        });

        return response.text || '';
    }

    async comparePokemon(pokemonList: Pokemon[]): Promise<string> {
        if (pokemonList.length < 2) {
            return 'Se necesitan al menos 2 Pokémon para comparar';
        }

        const comparison = pokemonList.map(p =>
            `${p.name}:
- Tipos: ${p.types.join(', ')}
- HP: ${p.stats.hp}, Ataque: ${p.stats.attack}, Defensa: ${p.stats.defense}
- Velocidad: ${p.stats.speed}`
        ).join('\n\n');

        const prompt = `Compara estos Pokémon y analiza sus ventajas y desventajas relativas:

${comparison}

Proporciona:
1. Comparación de estadísticas clave
2. Ventajas de tipos entre ellos
3. Roles recomendados para cada uno
4. Cuál elegir según diferentes situaciones`;

        const response = await this.ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt
        });

        return response.text || '';
    }

    async generatePokemonFacts(pokemon: Pokemon): Promise<string> {
        const prompt = `Genera curiosidades interesantes y descripciones creativas sobre ${pokemon.name}:

Información:
- Tipos: ${pokemon.types.join(', ')}
- Habilidades: ${pokemon.abilities.join(', ')}
- HP: ${pokemon.stats.hp}, Ataque: ${pokemon.stats.attack}, Defensa: ${pokemon.stats.defense}

Proporciona:
1. 3 curiosidades interesantes
2. Una descripción creativa de su estilo de batalla
3. Dato curioso sobre su diseño o inspiración`;

        const response = await this.ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt
        });

        return response.text || '';
    }

    private summarizeCollection(collection: CollectionPokemon[]): string {
        if (collection.length === 0) {
            return 'Colección vacía';
        }

        return collection.slice(0, 10).map(p =>
            `${p.name} (${p.types.join('/')})`
        ).join(', ') + (collection.length > 10 ? ` y ${collection.length - 10} más...` : '');
    }

    private calculateCollectionStats(collection: CollectionPokemon[]) {
        const typeCount: { [key: string]: number } = {};

        collection.forEach(p => {
            p.types.forEach(type => {
                typeCount[type] = (typeCount[type] || 0) + 1;
            });
        });

        const topTypes = Object.entries(typeCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type]) => type);

        const avgStats = {
            hp: collection.reduce((sum, p) => sum + p.stats.hp, 0) / collection.length,
            attack: collection.reduce((sum, p) => sum + p.stats.attack, 0) / collection.length,
            defense: collection.reduce((sum, p) => sum + p.stats.defense, 0) / collection.length,
            speed: collection.reduce((sum, p) => sum + p.stats.speed, 0) / collection.length
        };

        const highestStat = Object.entries(avgStats).sort((a, b) => b[1] - a[1])[0];

        return {
            total: collection.length,
            topTypes,
            highestAvgStat: highestStat[0]
        };
    }

    private getTotalStats(collection: CollectionPokemon[]) {
        if (collection.length === 0) {
            return { avgHp: 0, avgAttack: 0, avgDefense: 0, avgSpeed: 0 };
        }

        return {
            avgHp: Math.round(collection.reduce((sum, p) => sum + p.stats.hp, 0) / collection.length),
            avgAttack: Math.round(collection.reduce((sum, p) => sum + p.stats.attack, 0) / collection.length),
            avgDefense: Math.round(collection.reduce((sum, p) => sum + p.stats.defense, 0) / collection.length),
            avgSpeed: Math.round(collection.reduce((sum, p) => sum + p.stats.speed, 0) / collection.length)
        };
    }
}
