/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        aura: {
          black: '#0A0A0A',
          cream: '#F5F0E8',
          rose: '#E8A598',
          blush: '#F2C4BB',
          sage: '#8BAF8D',
          gold: '#C9A96E',
          mist: '#D4DCE8',
          deep: '#1A1025',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(232,165,152,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(232,165,152,0.6)' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(400%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      }
    },
  },
  plugins: [],
}
