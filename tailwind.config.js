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
        'quantum-glow': 'var(--quantum-glow)',
      },
      animation: {
        'quantum-pulse': 'quantumPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'quantum-float': 'quantumFloat 6s ease-in-out infinite',
        'quantum-glow': 'quantumGlow 2s ease-in-out infinite',
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
        quantumGlow: {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 12px var(--quantum-glow))',
            opacity: 0.8 
          },
          '50%': { 
            filter: 'drop-shadow(0 0 25px var(--quantum-glow))',
            opacity: 1 
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'quantum-gradient': 'radial-gradient(circle at center, var(--quantum-primary), transparent)',
        'neural-gradient': 'linear-gradient(to bottom right, var(--quantum-secondary), var(--quantum-accent))',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.quantum-border': {
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)',
        },
        '.quantum-text-glow': {
          textShadow: '0 0 8px var(--quantum-glow)',
        },
        '.quantum-bg-blur': {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(17, 24, 39, 0.7)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
  safelist: [
    'bg-cyan-500/10',
    'bg-cyan-500/20',
    'bg-purple-500/10',
    'bg-purple-500/20',
    'bg-emerald-500/10',
    'bg-emerald-500/20',
    'border-cyan-500/30',
    'border-purple-500/30',
    'border-emerald-500/30',
    'text-cyan-300',
    'text-purple-300',
    'text-emerald-300',
  ],
}