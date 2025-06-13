// tailwind.config.js
module.exports = {
  darkMode: 'class', // ✅ これを追加
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
