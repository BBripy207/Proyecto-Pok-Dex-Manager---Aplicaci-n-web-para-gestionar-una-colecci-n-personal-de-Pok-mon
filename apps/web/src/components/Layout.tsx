import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pokemon-navy via-pokemon-navy-dark to-blue-950">
            <Navbar />
            <main className="py-4">
                {children}
            </main>
        </div>
    );
}
