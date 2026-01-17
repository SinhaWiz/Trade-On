/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'trade-green': '#00C853',
        'trade-red': '#FF1744',
        'trade-dark': '#0D1117',
        'trade-card': '#161B22',
        'trade-border': '#30363D',
        'trade-accent': '#58A6FF',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(88, 166, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(88, 166, 255, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
