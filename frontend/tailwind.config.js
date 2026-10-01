/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          800: '#102a43',
          900: '#0b1b2b',
        },
        medical: {
          blue: '#0d47a1',
          teal: '#00897b',
          dark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
