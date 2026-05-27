import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { hitSlop44 } from '@/components/ui/a11y';
import { copy } from '@/constants/copy';
import type { LightAchievement, LightAchievementId } from '@/lib/streak/light-achievements';
import { colors, spacing } from '@/theme/tokens';

type LightAchievementRowProps = {
  achievements: LightAchievement[];
  onAchievementPress?: (id: LightAchievementId) => void;
};

function achievementTitle(id: LightAchievementId): string {
  const labels = copy.progress.lightAchievements;
  if (id === 'first_done') return labels.firstDone;
  if (id === 'streak_7') return labels.streak7;
  return labels.completed30;
}

function AchievementItem({
  achievement,
  onPress,
}: {
  achievement: LightAchievement;
  onPress?: (id: LightAchievementId) => void;
}) {
  const { id, unlocked } = achievement;
  const title = achievementTitle(id);
  const stateLabel = unlocked
    ? copy.progress.lightAchievements.unlocked
    : copy.progress.lightAchievements.locked;

  const content = (
    <View style={styles.item}>
      <View
        style={[
          styles.badge,
          unlocked ? styles.badgeUnlocked : styles.badgeLocked,
        ]}
      >
        <AppText
          variant="caption"
          color={unlocked ? colors.white : colors.textMuted}
          numberOfLines={1}
        >
          {unlocked ? '✓' : '·'}
        </AppText>
      </View>
      <AppText
        variant="caption"
        color={unlocked ? colors.textPrimary : colors.textMuted}
        style={styles.label}
        numberOfLines={2}
      >
        {title}
      </AppText>
    </View>
  );

  if (unlocked && onPress) {
    return (
      <Pressable
        onPress={() => onPress(id)}
        hitSlop={hitSlop44}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${stateLabel}`}
        style={styles.pressable}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View accessibilityRole="text" accessibilityLabel={`${title}, ${stateLabel}`} style={styles.pressable}>
      {content}
    </View>
  );
}

export function LightAchievementRow({
  achievements,
  onAchievementPress,
}: LightAchievementRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {achievements.map((achievement) => (
        <AchievementItem
          key={achievement.id}
          achievement={achievement}
          onPress={onAchievementPress}
        />
      ))}
    </ScrollView>
  );
}

const BADGE_SIZE = 48;

const styles = StyleSheet.create({
  row: {
    gap: spacing[4],
    paddingVertical: spacing[1],
  },
  pressable: {
    minWidth: 88,
    minHeight: 44,
  },
  item: {
    alignItems: 'center',
    gap: spacing[2],
    maxWidth: 96,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  badgeUnlocked: {
    backgroundColor: colors.ctaEnd,
    borderColor: colors.ctaEnd,
  },
  badgeLocked: {
    backgroundColor: colors.background,
    borderColor: colors.textMuted,
    opacity: 0.6,
  },
  label: {
    textAlign: 'center',
  },
});
