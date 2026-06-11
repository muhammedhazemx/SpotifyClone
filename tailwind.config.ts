import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        spotify: {
          green: 'var(--color-spotify-green)',
          black: 'var(--color-spotify-black)',
          dark: 'var(--color-spotify-dark)',
          surface: 'var(--color-spotify-surface)',
          surfaceHover: 'var(--color-spotify-surface-hover)',
          text: 'var(--color-spotify-text)',
          muted: 'var(--color-spotify-muted)',
          card: 'var(--color-spotify-card)',
          cardHover: 'var(--color-spotify-card-hover)',
          border: 'var(--color-spotify-border)',
        },
      },
      fontFamily: {
        sans: ['Figtree', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        xxs: '0.6875rem',
      },
      spacing: {
        sidebar: '280px',
        player: '90px',
      },
    },
  },
  plugins: [],
} satisfies Config;
