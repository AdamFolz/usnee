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
        // Telegram / Base44 design system colors
        tg: {
          text: '#ffffff',
          'text-secondary': '#8e8e93',
          'text-tertiary': '#636366',
          bg: '#0f0f0f',
          'bg-elevated': '#1c1c1c',
          'bg-secondary': '#2d2d2d',
          primary: '#007aff',
          'primary-foreground': '#ffffff',
          success: '#34c759',
          'success-foreground': '#ffffff',
          danger: '#ff3b30',
          'danger-foreground': '#ffffff',
          warning: '#ff9500',
          'warning-foreground': '#ffffff',
          separator: '#38383a',
          overlay: 'rgba(0,0,0,0.6)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.75rem',
      },
      animation: {
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
