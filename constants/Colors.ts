import { colors } from '@/theme/tokens';

const warmLight = {
  text: colors.textPrimary,
  muted: colors.textMuted,
  background: colors.background,
  tint: colors.ctaEnd,
  tabIconDefault: colors.textMuted,
  tabIconSelected: colors.ctaEnd,
} as const;

/** @deprecated Prefer `@/theme/tokens` for new UI. Kept for legacy screens during redesign. */
export default {
  light: warmLight,
  dark: warmLight,
};
