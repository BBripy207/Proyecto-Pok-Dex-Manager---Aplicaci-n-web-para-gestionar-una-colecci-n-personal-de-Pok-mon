import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-bold text-gray-800 mb-2">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 border-2 border-pokemon-cream-dark bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-orange focus:border-pokemon-orange transition-all ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
            )}
        </div>
    );
}
