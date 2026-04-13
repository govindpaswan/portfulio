/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#00d4ff',
          dark: '#0099bb',
          light: '#66e5ff',
        },
        accent: '#8b5cf6',
        surface: {
          DEFAULT: '#0f0f1a',
          card: '#161626',
          hover: '#1e1e35',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(0,212,255,0.3)' },
          'to': { boxShadow: '0 0 40px rgba(0,212,255,0.6)' },
        },
      },
    },
  },
  plugins: [],
}
