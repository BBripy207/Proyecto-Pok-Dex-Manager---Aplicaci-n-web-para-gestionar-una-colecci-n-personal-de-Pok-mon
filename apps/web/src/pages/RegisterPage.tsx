import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(email, password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="flex justify-center items-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />

                    {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-pokemon-blue hover:underline">
                        Login
                    </Link>
                </p>
            </Card>
        </Container>
    );
}
