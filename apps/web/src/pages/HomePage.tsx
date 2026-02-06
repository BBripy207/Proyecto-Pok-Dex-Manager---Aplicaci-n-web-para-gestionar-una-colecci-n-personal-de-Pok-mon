import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container } from '../components/Container';
import { Button } from '../components/Button';

export function HomePage() {
    const { user } = useAuth();

    return (
        <Container>
            <div className="text-center py-20">
                <h1 className="text-5xl font-bold mb-4">
                    Welcome to <span className="text-pokemon-red">PokeDex</span> Manager
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Manage your personal Pokemon collection
                </p>

                <div className="flex justify-center gap-4">
                    {user ? (
                        <>
                            <Link to="/pokemon">
                                <Button>Browse Pokemon</Button>
                            </Link>
                            <Link to="/collection">
                                <Button variant="secondary">My Collection</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register">
                                <Button>Get Started</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary">Login</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
}
