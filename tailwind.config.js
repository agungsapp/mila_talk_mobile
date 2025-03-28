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
    },
  },
  plugins: [],
}

