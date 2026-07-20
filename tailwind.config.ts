import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        cream: '#fdf8f0',
        parchment: '#f5e6d3',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        cursive: ['var(--font-dancing)', 'cursive'],
      },
      boxShadow: {
        'paper': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(0,0,0,0.05)',
        'paper-lg': '0 20px 60px -10px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
