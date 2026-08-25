/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        campus: {
          bg: '#070B14',
          card: '#0E1526',
          'card-hover': '#151F38',
          border: '#1E293B',
          'border-light': '#334155',
          lime: '#C6FF3D',
          'lime-hover': '#B2EB2C',
          pink: '#E8397A',
          purple: '#7C4DFF',
          cyan: '#00E5FF',
          gold: '#FBBF24',
          muted: '#8E9EB5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(198, 255, 61, 0.25)',
        'glow-pink': '0 0 25px -5px rgba(232, 57, 122, 0.25)',
        'glow-purple': '0 0 25px -5px rgba(124, 77, 255, 0.25)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
