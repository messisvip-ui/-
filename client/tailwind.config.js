/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'starlight': {
          50: '#f8f6ff',
          100: '#f0ebff',
          200: '#e2d9ff',
          300: '#ccbfff',
          400: '#b19bff',
          500: '#9274ff',
          600: '#754dff',
          700: '#5e2fff',
          800: '#4d24d9',
          900: '#411fb3',
        },
        'forest': {
          50: '#f2fcf6',
          100: '#e0f8ea',
          200: '#c7f0db',
          300: '#a3e3c6',
          400: '#75d0ab',
          500: '#4bb78d',
          600: '#339672',
          700: '#2b795e',
          800: '#26624e',
          900: '#225142',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
