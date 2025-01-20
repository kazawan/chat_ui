/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gray: '#F3F4F6',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'slide-out': 'slideOut 0.3s ease-out forwards',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      }
    },
  },
  plugins: [],
};
