import type { TextStyle } from 'react-native';

import { colors } from '@/theme/tokens';

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export type TypographyVariant =
  | 'hero'
  | 'title'
  | 'section'
  | 'cardTitle'
  | 'body'
  | 'bodySecondary'
  | 'secondary'
  | 'caption'
  | 'micro';

type TypographyStyle = Pick<TextStyle, 'fontSize' | 'fontFamily' | 'color' | 'lineHeight'>;

export const typography: Record<TypographyVariant, TypographyStyle> = {
  hero: {
    fontSize: 32,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    lineHeight: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  section: {
    fontSize: 20,
    fontFamily: fontFamily.semiBold,
    color: colors.textPrimary,
    lineHeight: 28,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  bodySecondary: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  secondary: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: colors.textMuted,
    lineHeight: 16,
  },
  micro: {
    fontSize: 10,
    fontFamily: fontFamily.medium,
    color: colors.textMuted,
    lineHeight: 14,
  },
};
