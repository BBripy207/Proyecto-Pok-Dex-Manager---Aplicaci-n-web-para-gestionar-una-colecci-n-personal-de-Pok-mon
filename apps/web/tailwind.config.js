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
        },
      },
    },
  },
  plugins: [],
}
