/** @type {import('tailwindcss').Config} */
export default {
   darkMode: 'class', // ✅ Required for theme toggling
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {colors: {
        brand: '#00ACF0',
      },},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
