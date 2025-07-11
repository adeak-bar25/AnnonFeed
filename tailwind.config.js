/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.hbs',
    './mod/*.js',
    './app.js',
    './public/script.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Roboto Flex"', 'Roboto', '"Noto Sans"', 'Arial', 'sans-serif'],
      },
      colors: {
        'main-orange': '#f36f3b',
        'secondary-orange': '#ff8352'
      },
      keyframes: {
        'float-f-b': {
          '0%': { translate: '0 50%', opacity: '0' },
          '100%': { translate: '0', opacity: '1' }
        },
      },
      animation: {
        'float-f-b': "float-f-b 1s ease-out",
      },
      screens: {
        'xs': '410px',
      },
    },
    plugins: [],
  }
}