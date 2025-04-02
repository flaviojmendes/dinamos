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
      fontSize: {
        h1: ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
        h3: ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        h4: ['1.5rem', { lineHeight: '1.35', fontWeight: '500' }],
        h5: ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        h6: ['1.125rem', { lineHeight: '1.45', fontWeight: '500' }],
        p: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
