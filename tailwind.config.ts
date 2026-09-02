import type { Config } from 'tailwindcss';
import { palette, radii } from './lib/design-tokens';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        border: 'var(--color-border)',
        muted: 'var(--color-muted)',
        burgundy: {
          DEFAULT: 'var(--color-burgundy)',
          hover: 'var(--color-burgundy-hover)',
          active: 'var(--color-burgundy-active)',
          light: 'var(--color-burgundy-light)',
        },
        brand: {
          bg: palette.bg,
          surface: palette.surface,
          surfaceAlt: palette.surfaceAlt,
          ink: palette.ink,
          inkAlt: palette.inkAlt,
          border: palette.border,
          borderLight: palette.borderLight,
          muted: palette.muted,
          mutedLight: palette.mutedLight,
          burgundy: palette.burgundy,
        },
      },
      borderRadius: {
        base: 'var(--radius-base)',
        DEFAULT: 'var(--radius-base)',
        sm: radii.sm,
        md: radii.md,
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderWidth: {
        hairline: '1px',
      },
    },
  },
  plugins: [],
};

export default config;
