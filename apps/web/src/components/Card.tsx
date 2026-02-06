import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-pokemon-cream rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-2 border-pokemon-cream-dark ${className}`}>
            {children}
        </div>
    );
}
