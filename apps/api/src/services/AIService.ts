import OpenAI from 'openai';

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
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            baseURL: 'https://api.openai.com/v1',
            apiKey: process.env.OPENAI_API_KEY || '',
        });
    }

    async generateRecommendations(collection: CollectionPokemon[]): Promise<string> {
        const summary = this.summarizeCollection(collection);
        const stats = this.calculateCollectionStats(collection);

        // Lista de nombres de Pokémon en la colección
        const pokemonNames = collection.map(p => p.name).join(', ');

        const prompt = `Eres un experto entrenador Pokémon. Analiza esta colección y recomienda EXACTAMENTE 4 Pokémon específicos que la complementen:

Pokémon en tu colección actual: ${pokemonNames}
Total: ${stats.total} Pokémon
Tipos dominantes: ${stats.topTypes.join(', ')}

Para cada uno de los 4 Pokémon recomendados, usa este formato EXACTO (sin números):

**NombreDelPokemon**
Explica cómo este Pokémon se combina estratégicamente con los que YA TIENES en tu colección (menciona nombres específicos de tu equipo actual), qué debilidades cubre y qué sinergia aporta al conjunto.

(Línea en blanco entre cada Pokémon)

IMPORTANTE: Debes recomendar EXACTAMENTE 4 Pokémon. Sé conciso y directo. Máximo 3-4 líneas por Pokémon. Menciona nombres específicos de los Pokémon que ya tiene el usuario.`;

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 600,
        });

        return completion.choices[0].message.content || '';
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

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
        });

        return completion.choices[0].message.content || '';
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

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
        });

        return completion.choices[0].message.content || '';
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

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
        });

        return completion.choices[0].message.content || '';
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
