import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container } from './Container';
import { Button } from './Button';
import pokeball from '../assets/Poké_Ball_icon.svg.png';

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
        <nav className="bg-pokemon-navy-dark text-white shadow-xl border-b-4 border-pokemon-orange">
            <Container>
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-3 text-2xl font-bold hover:scale-105 transition-transform">
                        <img src={pokeball} alt="Pokeball" className="w-8 h-8" />
                        <span>
                            <span className="text-pokemon-yellow">Poké</span><span className="text-pokemon-red">Dex</span> <span className="text-white">Manager</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <Link to="/pokemon" className="hover:text-pokemon-yellow transition-colors font-medium">
                                    Pokémon
                                </Link>
                                <Link to="/collection" className="hover:text-pokemon-yellow transition-colors font-medium">
                                    My Collection
                                </Link>
                                <span className="text-sm bg-pokemon-orange px-3 py-1 rounded-full font-bold">{user.email}</span>
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
                                    <Button>Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </nav>
    );
}
