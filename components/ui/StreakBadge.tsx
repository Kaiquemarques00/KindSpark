import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius } from '@/theme/tokens';

type StreakBadgeProps = {
  count: number;
};

export function StreakBadge({ count }: StreakBadgeProps) {
  return (
    <View style={styles.badge} accessibilityLabel={`${count} day streak`}>
      <Ionicons name="flame" size={16} color={colors.ctaEnd} accessibilityElementsHidden />
      <AppText variant="caption" color={colors.ctaEnd}>
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
  },
});
