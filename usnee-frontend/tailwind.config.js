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
        tg: {
          text: '#ffffff',
          'text-secondary': '#8e8e93',
          'text-tertiary': '#636366',
          bg: '#0f0f0f',
          'bg-elevated': '#1c1c1e',
          'bg-secondary': '#2c2c2e',
          'bg-glass': 'rgba(28, 28, 30, 0.72)',
          'bg-glass-light': 'rgba(44, 44, 46, 0.60)',
          primary: '#0a84ff',
          'primary-foreground': '#ffffff',
          success: '#30d158',
          'success-foreground': '#ffffff',
          danger: '#ff453a',
          'danger-foreground': '#ffffff',
          warning: '#ff9f0a',
          'warning-foreground': '#ffffff',
          separator: 'rgba(255,255,255,0.08)',
          'separator-strong': 'rgba(255,255,255,0.15)',
          overlay: 'rgba(0,0,0,0.5)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '1.25rem',
        'button': '1rem',
        'pill': '9999px',
      },
      animation: {
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
