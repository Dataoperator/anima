import { fontFamily } from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-35px) translateX(-10px)' },
          '75%': { transform: 'translateY(-20px) translateX(8px)' },
        },
        'tilt': {
          '0%, 50%, 100%': {
            transform: 'rotate(0deg)',
          },
          '25%': {
            transform: 'rotate(1deg)',
          },
          '75%': {
            transform: 'rotate(-1deg)',
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'spin-slow': 'spin-slow 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'tilt': 'tilt 10s ease-in-out infinite',
      },
      backgroundImage: {
        'anima-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%)',
        'anima-light': 'linear-gradient(to bottom right, rgb(238, 242, 255) 0%, rgb(243, 232, 255) 50%, rgb(253, 242, 248) 100%)',
        'anima-dark': 'linear-gradient(to bottom right, rgb(30, 27, 75) 0%, rgb(59, 7, 100) 50%, rgb(30, 27, 75) 100%)',
        'cyber-grid': 'linear-gradient(to right, #4f4f4f2e 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f2e 1px, transparent 1px)',
      },
      backdropBlur: {
        xs: '2px',
      },
      perspective: {
        'none': 'none',
        'sm': '250px',
        'md': '500px',
        'lg': '1000px',
        'xl': '2000px',
      },
      transformStyle: {
        'flat': 'flat',
        '3d': 'preserve-3d',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective': {
          perspective: '1000px'
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.rotate-y-90': {
          transform: 'rotateY(90deg)',
        },
        '.rotate-x-90': {
          transform: 'rotateX(90deg)',
        },
      };
      addUtilities(newUtilities);
    }
  ],
}