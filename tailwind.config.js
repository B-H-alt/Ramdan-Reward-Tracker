/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        ramadan: {
          gold: '#F59E0B',
          green: '#059669',
          purple: '#7C3AED',
          rose: '#F43F5E',
          sky: '#0EA5E9',
          cream: '#FEF9EE',
          dark: '#1E1B4B',
        }
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0)', opacity: '1' },
          '100%': { transform: 'translateY(200px) rotate(720deg)', opacity: '0' },
        }
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out',
        pop: 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        confetti: 'confetti 1s ease-out forwards',
      }
    },
  },
  plugins: [],
}
