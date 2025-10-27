// Use CommonJS export so PostCSS tooling (and many editors) can load this reliably.
// Use the official `tailwindcss` package name (not `@tailwindcss/postcss`).
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
