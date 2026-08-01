/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#020206',
        'obsidian': '#06070c',
        'ion': '#00f0ff',
        'plasma': '#ff3c7e',
        'signal': '#00e8a0',
        'amber-lux': '#ffb020',
        'nasa-red': '#fc3d21',
        'nasa-blue': '#0b3d91'
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        ui: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace']
      },
      boxShadow: {
        ion: '0 0 24px rgba(0, 240, 255, 0.12)',
        depth: '0 24px 64px rgba(0, 0, 0, 0.55)'
      }
    },
  },
  plugins: [],
}
