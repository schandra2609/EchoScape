/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We can add custom nature-inspired colors here later!
        forest: '#2d4a22',
        ocean: '#1e3a8a',
        mountain: '#475569'
      }
    },
  },
  plugins: [],
}