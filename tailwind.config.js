/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        canvas: {
          light: '#ffffff',
          dark: '#0a0a0b', // Tactical near-black
          paper: '#f8fafc', // Slate 50
        },
        // Tactical command-center palette (dark theme is the default).
        tactical: {
          bg: '#0a0a0b',       // app background
          surface: '#101012',  // panels
          raised: '#16161a',   // raised cells / hover
          border: '#26262b',   // hairline borders
          line: '#2f2f36',     // dividers / stronger lines
          label: '#8a909c',    // uppercase muted labels (AA on surface)
          dim: '#aab0bb',      // secondary text
          text: '#e5e7eb',     // primary text
        },
        signal: {
          green: '#4ade80', // online / success / completed
          amber: '#f59e0b', // section accent / warning / in-progress
          red: '#ef4444',   // classified / danger
          cyan: '#22d3ee',  // info / assessment
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
