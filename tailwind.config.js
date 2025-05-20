/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Memindai semua file JS, JSX, TS, TSX di src/
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f58634',
      },
      keyframes: {
        shakeLeftRight: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' }, // Goyang ke kanan
        },
      },
      animation: {
        'shake-left-right': 'shakeLeftRight 2s ease-in-out infinite', // Animasi berjalan terus-menerus
      },
    },
  },
  plugins: [],
}

