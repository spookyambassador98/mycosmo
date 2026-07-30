/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#050505',
        'nasa-red': '#fc3d21',
        'nasa-blue': '#0b3d91'
      }
    },
  },
  plugins: [],
}
