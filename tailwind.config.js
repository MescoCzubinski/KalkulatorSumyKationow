/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "top-agrar-green": "rgb(0, 132, 55)",
        "too-much": "#f91c1c",
        "too-little": "#6066ff",
        "bg-info": "#a3a3a3",
      },
    },
    fontFamily: {
      header: ["Poppins"],
      body: ["Lato"],
    },
  },
  plugins: [],
};
