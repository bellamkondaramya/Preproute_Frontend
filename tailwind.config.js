/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6475F8',
        primaryDark: '#1B55D9',
        ink: '#1F2937',
        muted: '#6B7280',
        soft: '#F6F8FC',
        line: '#E5E7EB',
        success: '#12B981',
        warning: '#F59E0B'
      },
      boxShadow: {
        card: '0 8px 30px rgba(17, 24, 39, 0.06)'
      }
    }
  },
  plugins: []
};
