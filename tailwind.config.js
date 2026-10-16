/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f6',
          100: '#ffe2ed',
          200: '#ffc5dc',
          300: '#ff8ab5',
          400: '#ff639c',
          500: '#f23d7f',
          600: '#ce205f',
          700: '#ad174f',
          800: '#8f1745',
          900: '#77183d',
          950: '#49091f',
        },
        slate: {
          50: '#f7f8fb',
          100: '#edf0f6',
          200: '#dde2eb',
          300: '#c6cedd',
          400: '#a6b0c3',
          500: '#647087',
          600: '#5a667d',
          700: '#323b4f',
          800: '#232a3a',
          900: '#151821',
          950: '#101218',
        },
        canvas: {
          light: '#ffffff',
          dark: '#101218',
          paper: '#f7f8fb',
        },
        // Trilha Info's shared dark surfaces. Existing utility names stay stable.
        tactical: {
          bg: '#101218',
          surface: '#151821',
          raised: '#1b202c',
          border: '#323b4f',
          line: '#323b4f',
          label: '#a6b0c3',
          dim: '#a6b0c3',
          text: '#f2f4f8',
        },
        // Muted accent palette. Calmer than neon so the UI reads minimal, not
        // like an alarm panel; still distinct enough to carry semantic meaning.
        signal: {
          green: '#6ee7c8', // online / success / completed
          amber: '#d9a441', // section accent / warning / in-progress
          red: '#e5645f',   // classified / danger
          cyan: '#56b6c8',  // info / assessment
        },
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        display: ['Bricolage Grotesque', 'Hanken Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        hand: ['Kalam', 'cursive'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
        'grid-pattern-dark': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      keyframes: {
        'caret-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1s steps(1) infinite',
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
