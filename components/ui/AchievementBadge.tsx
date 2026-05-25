import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/tokens';

export type AchievementBadgeState = 'locked' | 'active' | 'completed';

type AchievementBadgeProps = {
  days: number;
  state: AchievementBadgeState;
};

export function AchievementBadge({ days, state }: AchievementBadgeProps) {
  const label = `${days}d`;

  return (
    <View
      style={[
        styles.badge,
        state === 'locked' && styles.locked,
        state === 'active' && styles.active,
        state === 'completed' && styles.completed,
      ]}
      accessibilityLabel={`${days} day achievement, ${state}`}
    >
      <AppText
        variant="caption"
        color={
          state === 'locked'
            ? colors.textMuted
            : state === 'completed'
              ? colors.white
              : colors.ctaEnd
        }
      >
        {label}
      </AppText>
    </View>
  );
}

const BADGE_SIZE = 56;

const styles = StyleSheet.create({
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  locked: {
    backgroundColor: colors.background,
    borderColor: colors.textMuted,
    opacity: 0.6,
  },
  active: {
    backgroundColor: colors.peach,
    borderColor: colors.ctaEnd,
  },
  completed: {
    backgroundColor: colors.ctaEnd,
    borderColor: colors.ctaEnd,
  },
});
