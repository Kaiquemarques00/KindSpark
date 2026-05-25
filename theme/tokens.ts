import type { ViewStyle } from 'react-native';

export const colors = {
  background: '#F8F5F0',
  card: '#FFFFFF',
  modal: '#FFFFFF',
  peach: '#FFE8D8',
  textPrimary: '#1F1F1F',
  textSecondary: '#6D6D6D',
  textMuted: '#9A9A9A',
  ctaStart: '#FF8A3D',
  ctaEnd: '#FF6A21',
  success: '#2E9E5B',
  warning: '#E89C2D',
  accentYellow: '#FFC94A',
  accentGreen: '#77C48C',
  accentSoftRed: '#FF7B6E',
  accentSky: '#8FD6FF',
  overlay: 'rgba(0,0,0,0.35)',
  rewardOverlay: 'rgba(0,0,0,0.55)',
  white: '#FFFFFF',
} as const;

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48] as const;

export const screenPadding = { horizontal: 20, vertical: 16 } as const;

export const radius = {
  card: 20,
  primary: 24,
  modal: 28,
  input: 18,
  mini: 16,
  pill: 999,
} as const;

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export const shadows: Record<'card' | 'cta' | 'modal', ShadowStyle> = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 4,
  },
  cta: {
    shadowColor: '#FF6A21',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 6,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 60,
    elevation: 8,
  },
};

export const gradient = {
  cta: {
    start: colors.ctaStart,
    end: colors.ctaEnd,
    angle: 135,
  },
} as const;
