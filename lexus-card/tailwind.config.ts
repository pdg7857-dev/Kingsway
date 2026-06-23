import type { Config } from 'tailwindcss';

/**
 * Design tokens — §4 of the build spec.
 * Colours are also exposed as CSS custom properties in globals.css so they
 * can be referenced outside Tailwind (e.g. inline gradients, canvas).
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        graphite: '#1A1A1A',
        slate: '#6B6B6B',
        silver: '#C9CBCD',
        mist: '#F4F4F2',
        white: '#FFFFFF',
        accent: '#8A1F2B',
      },
      fontFamily: {
        // Wired to next/font CSS variables (see app/layout.tsx).
        display: ['var(--font-display)', 'var(--font-display-fallback)', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid scale — §4.
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.22em' }],
        caption: ['0.8125rem', { lineHeight: '1.5' }],
        body: ['1.0625rem', { lineHeight: '1.7' }],
        h2: ['clamp(2rem, 4vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        hero: ['clamp(2.75rem, 7vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        eyebrow: '0.22em',
        wide: '0.12em',
        widest: '0.25em',
      },
      maxWidth: {
        content: '1320px',
      },
      spacing: {
        gutter: '24px',
        'gutter-mobile': '20px',
        section: 'clamp(5rem, 12vh, 9rem)',
      },
      borderRadius: {
        none: '0',
        xs: '2px',
        sm: '4px',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        700: '700ms',
        800: '800ms',
        1000: '1000ms',
        1200: '1200ms',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.08) translate3d(-1%, -1.5%, 0)' },
        },
        'scroll-cue': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
        'rise-in': {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 20s ease-out forwards',
        'scroll-cue': 'scroll-cue 2s ease-in-out infinite',
        'rise-in': 'rise-in 800ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
