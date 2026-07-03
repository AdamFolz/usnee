/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        usnee: {
          900: '#0f0c29',
          800: '#302b63',
          700: '#24243e',
          600: '#4a4a8a',
          500: '#7c3aed',
          400: '#a855f7',
          300: '#c084fc',
          100: '#e9d5ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}