import type { PressableProps } from 'react-native';

/** Expands touch target to at least 44×44 pt when the visual control is smaller. */
export const hitSlop44: NonNullable<PressableProps['hitSlop']> = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
};
