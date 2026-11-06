/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          500: '#1b4d89', // Rich blue from logo
          600: '#153e70',
          700: '#0e2b50',
          800: '#0a1d37',
          900: '#061324',
        },
        ayur: {
          50: '#f2fbf4',
          100: '#e1f6e6',
          200: '#c4edd0',
          500: '#22c55e', // Vibrant leaf green from logo
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        violet: {
          brand: '#5e2586', // Purple from logo
          light: '#7e35b3',
          dark: '#411560',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px rgba(22, 163, 74, 0.25)',
      }
    },
  },
  plugins: [],
}

