/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "extra-sm": "425px"
      },
      boxShadow: {
        'pink-hover': '0 0 10px 4px rgba(0, 150, 255,0.5)',
      }
    },
  },
  plugins: [],
}