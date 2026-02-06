/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#EE1515',
          yellow: '#FFCB05',
          blue: '#3B4CCA',
          navy: '#1e3a5f',
          'navy-dark': '#162d4a',
          cream: '#f5e6d3',
          'cream-dark': '#e8d5bc',
          orange: '#FF6B35',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
