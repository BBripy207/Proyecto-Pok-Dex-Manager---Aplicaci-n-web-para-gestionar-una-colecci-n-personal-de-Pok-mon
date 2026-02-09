import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container } from './Container';
import { Button } from './Button';
import pokeball from '../assets/Poké_Ball_icon.svg.png';

export function Navbar() {
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setShowMobileMenu(false);
            }
        }

        if (showMenu || showMobileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showMenu, showMobileMenu]);

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed');
        }
    }

    return (
        <>
            {/* Overlay oscuro */}
            {showMobileMenu && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}

            {/* Menú lateral deslizante */}
            <div
                ref={mobileMenuRef}
                className={`fixed top-0 left-0 h-full w-64 bg-pokemon-navy-dark text-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-pokemon-orange/30">
                    <div className="flex items-center gap-2">
                        <img src={pokeball} alt="Pokeball" className="w-8 h-8" />
                        <span className="text-lg font-bold">
                            <span className="text-pokemon-yellow">Poké</span><span className="text-pokemon-red">Dex</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setShowMobileMenu(false)}
                        className="text-white hover:text-pokemon-yellow"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="py-4">
                    <Link
                        to="/"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 px-6 py-4 hover:bg-pokemon-orange/20 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Pokémon
                    </Link>
                    {user && (
                        <>
                            <Link
                                to="/collection"
                                onClick={() => setShowMobileMenu(false)}
                                className="flex items-center gap-3 px-6 py-4 hover:bg-pokemon-orange/20 transition-colors font-medium"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                My Collection
                            </Link>
                            <Link
                                to="/ai-analysis"
                                onClick={() => setShowMobileMenu(false)}
                                className="flex items-center gap-3 px-6 py-4 hover:bg-pokemon-orange/20 transition-colors font-medium"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                Team Builder
                            </Link>
                        </>
                    )}
                    {!user && (
                        <Link
                            to="/register"
                            onClick={() => setShowMobileMenu(false)}
                            className="flex items-center gap-3 px-6 py-4 hover:bg-pokemon-orange/20 transition-colors font-medium"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Register
                        </Link>
                    )}
                </div>
            </div>

            <nav className="bg-pokemon-navy-dark text-white shadow-xl border-b-4 border-pokemon-orange">
                <Container>
                    <div className="flex justify-between items-center h-16">
                        {/* Hamburguesa izquierda */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="lg:hidden text-white hover:text-pokemon-yellow p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Links desktop izquierda */}
                        {user && (
                            <div className="hidden lg:flex gap-6">
                                <Link to="/" className="hover:text-pokemon-yellow transition-colors font-medium">
                                    Pokémon
                                </Link>
                                <Link to="/collection" className="hover:text-pokemon-yellow transition-colors font-medium">
                                    My Collection
                                </Link>
                                <Link to="/ai-analysis" className="hover:text-pokemon-yellow transition-colors font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                    </svg>
                                    Team Builder
                                </Link>
                            </div>
                        )}

                        {/* Logo centro */}
                        <Link to="/" className="flex items-center gap-2 lg:gap-3 text-xl lg:text-2xl font-bold hover:opacity-90 transition-opacity lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
                            <img src={pokeball} alt="Pokeball" className="w-7 h-7 lg:w-8 lg:h-8" />
                            <span>
                                <span className="text-pokemon-yellow">Poké</span><span className="text-pokemon-red">Dex</span> <span className="text-white">Manager</span>
                            </span>
                        </Link>

                        {/* Menú usuario derecha */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div ref={menuRef} className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="bg-pokemon-orange hover:bg-orange-600 p-2 rounded-full border-2 border-orange-700 transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {showMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-pokemon-cream border-2 border-pokemon-cream-dark rounded-lg shadow-xl overflow-hidden z-50">
                                            <div className="px-4 py-3 border-b border-pokemon-cream-dark">
                                                <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/collection"
                                                onClick={() => setShowMenu(false)}
                                                className="block px-4 py-3 text-gray-800 hover:bg-pokemon-orange hover:text-white transition-colors font-medium"
                                            >
                                                My Collection
                                            </Link>
                                            <Link
                                                to="/ai-analysis"
                                                onClick={() => setShowMenu(false)}
                                                className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-pokemon-orange hover:text-white transition-colors font-medium"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                                </svg>
                                                Team Builder
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setShowMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-3 font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors border-t border-pokemon-cream-dark"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to="/login">
                                        <Button variant="secondary" className="text-sm px-3 py-2">Login</Button>
                                    </Link>
                                    <Link to="/register" className="hidden sm:block">
                                        <Button className="text-sm px-3 py-2">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </nav>
        </>
    );
}
