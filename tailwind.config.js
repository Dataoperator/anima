/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#10b981',
          glow: '#22c55e'
        }
      }
    }
  },
  plugins: []
};