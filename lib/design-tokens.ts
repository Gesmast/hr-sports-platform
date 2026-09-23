/**
 * HR Sports Design System Tokens
 * Single source of truth for color palette, spacing, typography, and responsive breakpoints.
 */

export const palette = {
  bg: '#FFFFFF',
  surface: '#000000',
  surfaceAlt: '#000000',
  ink: '#111111',
  inkAlt: '#1A1A1A',
  border: '#27272A',
  borderLight: '#D8D3C8',
  muted: '#52525B',
  mutedLight: '#71717A',
  accentInverted: '#000000',
  burgundy: '#950606',
  burgundyHover: '#7B0505',
  burgundyActive: '#5F0404',
  burgundyLight: '#FDF2F4',
} as const;

export const radii = {
  none: '0px',
  base: '4px',
  sm: '2px',
  md: '4px',
  full: '9999px',
} as const;

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  standard: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const designTokens = {
  palette,
  radii,
  breakpoints,
  spacing,
  transitions,
};

export default designTokens;
