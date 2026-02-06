import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
}

export function Button({ children, variant = 'primary', fullWidth, className = '', ...props }: ButtonProps) {
    const baseStyles = 'px-6 py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-2';

    const variants = {
        primary: 'bg-pokemon-red hover:bg-red-600 text-white border-red-700',
        secondary: 'bg-pokemon-orange hover:bg-orange-600 text-white border-orange-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white border-red-800',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
