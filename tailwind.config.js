/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          brand: '#F7941D',
        },
        dark: {
          900: '#0D0D0D',
          800: '#111111',
          700: '#1A1A1A',
          600: '#2A2A2A',
        },
        gray: {
          100: '#FFFFFF',
          200: '#CCCCCC',
          400: '#888888',
          600: '#555555',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
