/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '104': '24rem',
        '128': '32rem', // Example of custom width (512px)
      }
    },
  },
  plugins: [],
}