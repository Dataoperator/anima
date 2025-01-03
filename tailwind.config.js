/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quantum-blue': 'var(--quantum-primary)',
        'quantum-purple': 'var(--quantum-secondary)',
        'quantum-green': 'var(--quantum-accent)',
      },
      animation: {
        'quantum-pulse': 'quantumPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'quantum-float': 'quantumFloat 6s ease-in-out infinite',
      },
      keyframes: {
        quantumPulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        quantumFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}