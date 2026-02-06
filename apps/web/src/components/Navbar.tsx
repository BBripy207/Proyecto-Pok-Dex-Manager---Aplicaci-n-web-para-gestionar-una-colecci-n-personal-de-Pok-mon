import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container } from './Container';
import { Button } from './Button';
import pokeball from '../assets/Poké_Ball_icon.svg.png';

export function Navbar() {
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showMenu]);

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
                    <Link to="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-opacity">
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
                                <div ref={menuRef} className="relative">
                                    <button 
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="bg-pokemon-orange hover:bg-orange-600 px-4 py-2 rounded-lg font-bold border-2 border-orange-700 transition-all duration-200"
                                    >
                                        {user.email}
                                    </button>
                                    {showMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-pokemon-cream border-2 border-pokemon-cream-dark rounded-lg shadow-xl overflow-hidden z-50">
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-3 text-left font-bold text-gray-800 hover:bg-pokemon-orange hover:text-white transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
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
