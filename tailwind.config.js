/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwritten: '"Schoolbell", cursive',
        title: "'Hanken Grotesk', sans-serif",
        content: "'Hanken Grotesk', sans-serif'",
        monospace: '"Roboto Mono", monospace',
      },
      colors: {
        black: "#000002",
        primary: "#E1047B",
        "primary-hover": "#FC52AE",
        "primary-shadow": "#FDFDFD",
        "text-primary": "#FDFDFD",
        "title-primary": "#D7BECB",
        "box-primary": "rgba(56, 1, 31, 0.80)",
        "box-primary-shadow":
          "linear-gradient(0deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.08) 100%), rgba(56, 1, 31, 0.80);",
        "text-secondary": "#008FF6",
        "menu-background": "rgba(255, 255, 255)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
