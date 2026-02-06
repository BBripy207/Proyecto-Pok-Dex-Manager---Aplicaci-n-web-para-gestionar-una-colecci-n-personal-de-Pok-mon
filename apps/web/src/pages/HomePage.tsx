import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import pokeball from '../assets/Poké_Ball_icon.svg.png';

export function HomePage() {
    const { user } = useAuth();

    return (
        <Container>
            <div className="text-center py-10">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <img src={pokeball} alt="Pokeball" className="w-16 h-16 animate-spin-slow" />
                    <h1 className="text-6xl font-extrabold text-white drop-shadow-lg">
                        <span className="text-pokemon-yellow">Poké</span><span className="text-pokemon-red">Dex</span> <span className="text-white">Manager</span>
                    </h1>
                    <img src={pokeball} alt="Pokeball" className="w-16 h-16 animate-spin-slow" />
                </div>
                

                <div className="flex justify-center gap-4">
                    {user ? (
                        <>
                            <Link to="/">
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
