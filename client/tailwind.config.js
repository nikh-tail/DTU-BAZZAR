/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        campus: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          'card-hover': '#F1F5F9',
          border: '#E2E8F0',
          'border-light': '#CBD5E1',
          lime: '#C6FF3D',
          'lime-hover': '#B2EB2C',
          pink: '#E8397A',
          purple: '#7C4DFF',
          cyan: '#0284C7',
          gold: '#D97706',
          muted: '#64748B',
          dark: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 4px 20px -2px rgba(198, 255, 61, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.08)',
        'glow-pink': '0 4px 20px -2px rgba(232, 57, 122, 0.3)',
        'glow-purple': '0 4px 20px -2px rgba(124, 77, 255, 0.3)',
        'card-light': '0 4px 20px -4px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -6px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
