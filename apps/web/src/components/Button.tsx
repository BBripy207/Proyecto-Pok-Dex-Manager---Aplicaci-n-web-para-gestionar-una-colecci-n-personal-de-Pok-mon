import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
}

export function Button({ children, variant = 'primary', fullWidth, className = '', ...props }: ButtonProps) {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-pokemon-red hover:bg-red-600 text-white',
        secondary: 'bg-pokemon-blue hover:bg-blue-600 text-white',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
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
