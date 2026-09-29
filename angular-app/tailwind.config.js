/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // V1 Colors (kept for compatibility with existing hardcoded classes if any were refactored)
        wine: '#6E2A34',
        darkWine: '#5C2129',
        cream: '#FBF6EF',
        sand: '#F4EDE3',
        sandBorder: '#E4D9C8',
        pinkAccent: '#D9A6A0',
        sageGreen: '#5F6F52',
        textDark: '#2B2A26',
        textMuted: '#7A7163',
        
        // V2 Design Tokens
        'bg': '#fafaf9',
        'surface': '#ffffff',
        'rose-50': '#fff1f2',
        'rose-100': '#ffe4e6',
        'rose-600': '#e11d48',
        'rose-700': '#be123c',
        'sage-50': '#f4f7f4',
        'sage-600': '#527853',
        'text': '#292524',
        'text-muted': '#57534e',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'display-vi': ['Playfair Display', 'Georgia', 'serif'],
        'display-ko': ['Playfair Display', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'none': '0',
        'xs': '8px',
        'sm': '12px',
        DEFAULT: '12px',
        'md': '20px',
        'lg': '20px',
        'xl': '20px',
        '2xl': '20px',
        '3xl': '20px',
        'pill': '9999px',
        'full': '9999px',
      },
      boxShadow: {
        'rest': '0 12px 24px -6px rgb(225 29 72 / 0.12)',
        'hover': '0 20px 30px -10px rgb(225 29 72 / 0.2)',
      }
    }
  },
  plugins: [],
}
