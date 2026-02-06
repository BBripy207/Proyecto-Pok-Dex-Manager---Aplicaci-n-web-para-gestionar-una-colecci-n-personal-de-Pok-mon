import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container } from './Container';
import { Button } from './Button';

export function Navbar() {
    const { user, logout } = useAuth();

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed');
        }
    }

    return (
        <nav className="bg-pokemon-red text-white shadow-lg">
            <Container>
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold">
                        PokeDex Manager
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to="/pokemon" className="hover:text-pokemon-yellow transition-colors">
                                    Pokemon
                                </Link>
                                <Link to="/collection" className="hover:text-pokemon-yellow transition-colors">
                                    My Collection
                                </Link>
                                <span className="text-sm">{user.email}</span>
                                <Button variant="secondary" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="secondary">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="secondary">Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </nav>
    );
}
