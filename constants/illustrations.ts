import type { ImageSourcePropType } from 'react-native';

/**
 * Final art paths (replace peach placeholder PNGs in assets/illustrations/).
 * Until then, screens use `Illustration` without `source` so icons stay visible.
 */
export const illustrations = {
  onboardingWelcome: require('@/assets/illustrations/onboarding-welcome.png'),
  onboardingValue: require('@/assets/illustrations/onboarding-value.png'),
  actionHeart: require('@/assets/illustrations/action-heart.png'),
  emptyHistory: require('@/assets/illustrations/empty-history.png'),
} as const satisfies Record<string, ImageSourcePropType>;
