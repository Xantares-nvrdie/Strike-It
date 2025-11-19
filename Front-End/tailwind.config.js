/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Daftarkan font 'Outfit' di sini
      fontFamily: {
        sans: ['Outfit', 'sans-serif'], // Ini menjadikannya font default
      },
    },
  },
  plugins: [],
}