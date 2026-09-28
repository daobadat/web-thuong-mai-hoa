/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        wine: '#6E2A34',
        darkWine: '#5C2129',
        cream: '#FBF6EF',
        sand: '#F4EDE3',
        sandBorder: '#E4D9C8',
        pinkAccent: '#D9A6A0',
        sageGreen: '#5F6F52',
        textDark: '#2B2A26',
        textMuted: '#7A7163',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        'display-vi': ['Playfair Display', 'serif'],
        'display-ko': ['Noto Serif KR', 'serif'],
      }
    }
  },
  plugins: [],
}
