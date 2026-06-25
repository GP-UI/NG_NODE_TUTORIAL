/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,css}',
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(56, 189, 248, 0.15), 0 20px 50px -20px rgba(56, 189, 248, 0.5)',
      },
    },
  },
  plugins: [],
};
