const colors = require('tailwindcss/colors')
console.log('tailwind config')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      // red: colors.red,
      // yellow: colors.amber,
      green: {
        // 50: '#f0fdf4',
        100: '#c4ddc5',
        // 200: '#bbf7d0',
        // 300: '#86efac',
        // 400: '#4ade80',
        // 500: '#22c55e',
        600: '#2d842f',
        // 700: '#15803d',
        // 800: '#166534',
        // 900: '#14532d',
      },
      // blue: colors.blue,
      // indigo: colors.indigo,
      // purple: colors.violet,
      // pink: colors.pink,
    },
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
    }
  },
  plugins: [],
}
