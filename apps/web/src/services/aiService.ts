const API_URL = 'http://localhost:3000/api';

async function fetchAPI(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

export const aiService = {
    async getRecommendations(): Promise<{ success: boolean; recommendations: string; totalPokemon: number }> {
        return fetchAPI('/ai/recommendations');
    },
};
