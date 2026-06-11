/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e', // Primary Red Coral
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        primary: '#f43f5e', // Red Coral
        secondary: '#0f172a', // Slate 900
        background: '#ffffff', // Clean white
        surface: '#f8fafc', // Slate 50
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(244, 63, 94, 0.1)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
