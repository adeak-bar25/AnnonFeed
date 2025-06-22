/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.hbs',
    './app.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Roboto Flex"', 'Roboto', '"Noto Sans"', 'Arial', 'sans-serif'],
      },
      colors: {
        'main-orange': '#f36f3b',
        'secondary-orange': '#ff8352'
      }
    },
  },
  plugins: [],
}

