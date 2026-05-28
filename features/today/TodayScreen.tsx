import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import {
  ActionCard,
  AdBanner,
  AppText,
  Button,
  ScreenShell,
  StreakBadge,
} from '@/components/ui';
import { copy } from '@/constants/copy';
import { useAppSession } from '@/features/auth';
import { TodayDoneSection } from '@/features/today/TodayDoneSection';
import { useStreakBadge } from '@/features/today/useStreakBadge';
import { useTodayLoop } from '@/features/today/useTodayLoop';
import { getDisplayName } from '@/lib/format/display-name';
import { getTimeGreeting } from '@/lib/format/greeting';
import { colors, spacing } from '@/theme/tokens';

const TAB_BAR_INSET = 96;

export function TodayScreen() {
  const { session } = useAppSession();
  const displayName = getDisplayName(session);
  const greeting = getTimeGreeting();

  const { streak, load: loadStreak } = useStreakBadge();
  const {
    suggestion,
    todayDone,
    busy,
    error,
    currentSuggestionSkipped,
    load,
    handleDone,
    handleSkip,
    handleRefresh,
    isCompleted,
    isOffline,
    pendingSync,
  } = useTodayLoop();

  useFocusEffect(
    useCallback(() => {
      load();
      loadStreak();
    }, [load, loadStreak]),
  );

  const loading = busy === 'load' && !suggestion;
  const actionDisabled = busy !== null && busy !== 'load';
  const showPrimaryActions = !currentSuggestionSkipped;

  const offlineMessage = pendingSync ? copy.today.offlinePending : copy.today.offlineCached;

  return (
    <ScreenShell
      scrollable
      contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_INSET }]}
    >
      <View style={styles.header}>
        <AppText variant="section" numberOfLines={1} style={styles.greeting}>
          {greeting}, {displayName}
        </AppText>
        {streak > 0 ? <StreakBadge count={streak} /> : null}
      </View>

      {isOffline ? (
        <AppText variant="caption" color={colors.textMuted} style={styles.centered}>
          {offlineMessage}
        </AppText>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color={colors.ctaEnd} style={styles.loader} />
      ) : null}

      {!loading && !isCompleted && suggestion ? (
        <ActionCard
          title={suggestion.title}
          description={suggestion.description}
          category={suggestion.category}
        />
      ) : null}

      {!loading && !isCompleted && !suggestion && !error ? (
        <AppText variant="bodySecondary" style={styles.centered}>
          {copy.today.emptySuggestion}
        </AppText>
      ) : null}

      {currentSuggestionSkipped && !isCompleted ? (
        <AppText variant="secondary" color={colors.textMuted} style={styles.centered}>
          {copy.today.skipHint}
        </AppText>
      ) : null}

      {error ? (
        <AppText variant="caption" color={colors.warning} style={styles.centered}>
          {error}
        </AppText>
      ) : null}

      {!loading && !isCompleted && suggestion ? (
        <View style={styles.actions}>
          {showPrimaryActions ? (
            <>
              <Button
                label={copy.today.didIt}
                variant="primary"
                onPress={handleDone}
                loading={busy === 'done'}
                disabled={actionDisabled}
              />
              <Button
                label={copy.today.skip}
                variant="secondary"
                onPress={handleSkip}
                loading={busy === 'skip'}
                disabled={actionDisabled}
              />
            </>
          ) : null}
          <Button
            label={copy.today.newIdea}
            variant="text"
            icon="refresh"
            onPress={handleRefresh}
            loading={busy === 'refresh'}
            disabled={actionDisabled}
          />
        </View>
      ) : null}

      {!loading && isCompleted && todayDone ? (
        <TodayDoneSection todayDone={todayDone} suggestion={suggestion} />
      ) : null}

      <AdBanner placement="today_bottom" />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  greeting: {
    flex: 1,
  },
  centered: {
    textAlign: 'center',
  },
  loader: {
    marginVertical: spacing[6],
  },
  actions: {
    gap: spacing[3],
    marginTop: spacing[2],
  },
});
