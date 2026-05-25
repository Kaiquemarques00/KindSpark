import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/tokens';

type ListRowProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  showChevron?: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
};

export function ListRow({
  icon,
  label,
  value,
  showChevron = false,
  onPress,
  rightElement,
}: ListRowProps) {
  const content = (
    <>
      {icon ? (
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={22} color={colors.textPrimary} />
        </View>
      ) : null}
      <AppText variant="body" style={styles.label} numberOfLines={1}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="secondary" color={colors.textMuted} style={styles.value} numberOfLines={1}>
          {value}
        </AppText>
      ) : null}
      {rightElement}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} accessibilityLabel="" />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={value ? `${label}, ${value}` : label}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
  value: {
    marginRight: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
