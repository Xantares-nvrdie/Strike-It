// tailwind.config.js
module.exports = {
  content: [
    // Pastikan path ke komponen Vue Anda sudah benar
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        // Tambahkan warna kustom Anda di sini
        'strike-blue': '#0768a0', 
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}