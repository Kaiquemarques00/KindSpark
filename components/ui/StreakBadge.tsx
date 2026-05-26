import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius } from '@/theme/tokens';

type StreakBadgeProps = {
  count: number;
};

export function StreakBadge({ count }: StreakBadgeProps) {
  return (
    <View
      style={styles.badge}
      accessibilityRole="text"
      accessibilityLabel={`${count} day streak`}
    >
      <Ionicons
        name="flame"
        size={16}
        color={colors.ctaEnd}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <AppText variant="caption" color={colors.ctaEnd} accessibilityElementsHidden>
        {count}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.peach,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    minHeight: 32,
    minWidth: 44,
    justifyContent: 'center',
  },
});
