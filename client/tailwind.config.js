const colors = require("tailwindcss/colors")

module.exports = {
  purge: {
    mode: "layers",
    content: ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx", "public/**/*.html"]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: colors.lightBlue,
        gray: colors.trueGray
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
