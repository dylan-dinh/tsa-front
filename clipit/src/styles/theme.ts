// ClipFlow design tokens.
// Replaces the old @mui/material theme (which was unused and not installed).
// Plain TS — safe to import from any React Native / react-native-web component.

import { Platform } from 'react-native';

export const colors = {
  // Surfaces (dark by default)
  bg: '#050509',
  surface: '#0D0D14',
  card: '#151521',
  cardElevated: '#1B1B29',
  cardBorder: 'rgba(255,255,255,0.06)',
  hairline: 'rgba(255,255,255,0.08)',

  // Brand
  purple: '#9146FF',
  electric: '#B067FF',
  purpleSoft: 'rgba(176,103,255,0.14)',

  // Text
  white: '#F5F5FA',
  gray: '#A1A1AA',
  dim: '#6B6B78',
  faint: '#3A3A46',

  // States
  danger: '#EF4444',
  success: '#22C55E',
  black: '#000000',
} as const;

export const gradients = {
  brand: ['#9146FF', '#B067FF'] as [string, string],
  brandCss: 'linear-gradient(135deg, #9146FF, #B067FF)',
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

// 4pt spacing scale
export const spacing = (n: number): number => n * 4;

export const font = {
  // Hanken Grotesk is the ClipFlow UI face; falls back to system on native.
  family: Platform.select({ web: "'Hanken Grotesk', system-ui, sans-serif", default: undefined }),
  mono: Platform.select({ web: "'JetBrains Mono', monospace", default: 'SpaceMono-Regular' }),
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

// Cross-platform elevation helper.
export const shadow = (level: 1 | 2 | 3 = 2) => {
  const map = {
    1: { y: 4, blur: 12, opacity: 0.35 },
    2: { y: 12, blur: 30, opacity: 0.45 },
    3: { y: 24, blur: 48, opacity: 0.5 },
  } as const;
  const s = map[level];
  return Platform.select({
    web: { boxShadow: `0 ${s.y}px ${s.blur}px -${Math.round(s.blur / 2)}px rgba(20,8,40,${s.opacity})` },
    default: {
      shadowColor: '#1a0a32',
      shadowOffset: { width: 0, height: s.y },
      shadowOpacity: s.opacity,
      shadowRadius: s.blur / 2,
      elevation: s.y,
    },
  }) as object;
};

// Format helpers used across feed cards.
export const fmtCount = (n: number): string => {
  if (n == null || isNaN(n)) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n >= 100_000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(n);
};

export const fmtDuration = (seconds: number): string => {
  const s = Math.max(0, Math.round(seconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? '0' : ''}${r}`;
};

export default { colors, gradients, radii, spacing, font, shadow };
