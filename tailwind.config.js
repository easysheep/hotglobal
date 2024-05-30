/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        purple1: 'rgb(162, 107, 206)',
        green1:'rgb(40 228 138)',
      }
    },
    fontFamily: {
      monte: ["Montserrat", "sans-serif"],
      poet:["Poetsen One", "sans-serif"],
      raleway:["Raleway", "sans-serif"],
      roboto:["Roboto Slab", "serif"],
    },

  }
};
