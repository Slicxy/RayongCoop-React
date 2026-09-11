/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#0f2b5c',
          950: '#081736',
        },
        coop: {
          blue: '#0f2b5c',
          gold: '#f59e0b',
          teal: '#0d9488',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        heading: ['"Google Sans"', 'Prompt', 'sans-serif'],
        body: ['"Google Sans"', 'Prompt', 'Sarabun', 'Inter', 'sans-serif'],
        display: ['"Google Sans"', 'Kanit', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
