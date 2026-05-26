import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme/tokens';

type PaginationDotsProps = {
  count: number;
  activeIndex: number;
};

export function PaginationDots({ count, activeIndex }: PaginationDotsProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="tablist"
      accessibilityLabel={`Step ${activeIndex + 1} of ${count}`}
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <View
            key={index}
            style={[styles.dot, isActive ? styles.dotActive : styles.dotInactive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Step ${index + 1} of ${count}`}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: radius.pill,
  },
  dotActive: {
    width: 10,
    height: 10,
    backgroundColor: colors.ctaEnd,
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: colors.textMuted,
    opacity: 0.5,
  },
});
