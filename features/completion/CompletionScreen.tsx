import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  CelebrationBurst,
  Illustration,
  ScreenShell,
} from '@/components/ui';
import { copy } from '@/constants/copy';
import { pickCelebrationMessage } from '@/features/completion/pick-celebration-message';
import { useCompletionSummary } from '@/features/completion/useCompletionSummary';
import { trackEvent } from '@/lib/analytics';
import { colors, spacing } from '@/theme/tokens';

const DATE_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type CompletionScreenProps = {
  actionDate?: string;
  offline?: boolean;
};

function isValidActionDate(value: string | undefined): value is string {
  return typeof value === 'string' && DATE_PARAM_PATTERN.test(value);
}

function streakDaysLabel(count: number): string {
  if (count === 1) return `1 ${copy.progress.day}`;
  return `${count} ${copy.progress.days}`;
}

export function CompletionScreen({ actionDate, offline = false }: CompletionScreenProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const mountTimeRef = useRef(Date.now());
  const exitTrackedRef = useRef(false);
  const shownTrackedRef = useRef(false);

  const validActionDate = isValidActionDate(actionDate);
  const { streak, completedCount, loading } = useCompletionSummary();
  const subtitle = validActionDate ? pickCelebrationMessage(actionDate) : '';
  const { height: windowHeight } = useWindowDimensions();
  const compact = Platform.OS !== 'web' && windowHeight < 720;

  const durationMs = useCallback(() => Date.now() - mountTimeRef.current, []);

  const trackDismissed = useCallback(() => {
    if (exitTrackedRef.current) return;
    exitTrackedRef.current = true;
    trackEvent('completion_screen_dismissed', { duration_ms: durationMs() });
  }, [durationMs]);

  useEffect(() => {
    if (validActionDate) return;
    router.replace('/(tabs)');
  }, [router, validActionDate]);

  useEffect(() => {
    if (!validActionDate || shownTrackedRef.current || loading) return;
    shownTrackedRef.current = true;
    trackEvent('completion_screen_shown', {
      action_date: actionDate,
      offline,
      ...(streak != null ? { streak } : {}),
    });
  }, [actionDate, loading, offline, streak, validActionDate]);

  useEffect(() => {
    if (!validActionDate) return;

    const unsubscribe = navigation.addListener('beforeRemove', () => {
      trackDismissed();
    });

    return unsubscribe;
  }, [navigation, trackDismissed, validActionDate]);

  const handleClose = useCallback(() => {
    trackDismissed();
    router.back();
  }, [router, trackDismissed]);

  const handleSeeProgress = useCallback(() => {
    exitTrackedRef.current = true;
    trackEvent('completion_cta_progress', { duration_ms: durationMs() });
    router.replace('/(tabs)/progress');
  }, [durationMs, router]);

  const handleSeeHistory = useCallback(() => {
    exitTrackedRef.current = true;
    trackEvent('completion_cta_history', { duration_ms: durationMs() });
    router.replace('/(tabs)/history');
  }, [durationMs, router]);

  if (!validActionDate) {
    return null;
  }

  const showSummary = !loading && (streak !== null || completedCount !== null);

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <View style={styles.layout}>
        <View style={styles.heroSection}>
          <View style={styles.burstLayer} pointerEvents="none">
            <CelebrationBurst />
          </View>
          <Illustration
            size="empty"
            placeholderIcon="sparkles"
            accessibilityLabel="Completion celebration"
            style={compact ? styles.illustrationCompact : styles.illustration}
          />
          <AppText variant="title" style={styles.centered}>
            {copy.completion.headline}
          </AppText>
          <AppText variant="bodySecondary" style={styles.centered} numberOfLines={2}>
            {subtitle}
          </AppText>
        </View>

        {showSummary ? (
          <Card style={[styles.summaryCard, compact && styles.summaryCardCompact]}>
            {streak !== null ? (
              <View style={styles.summaryRow}>
                <View style={styles.summaryLabel}>
                  <Ionicons name="flame" size={20} color={colors.ctaEnd} />
                  <AppText variant="secondary" color={colors.textSecondary}>
                    {copy.completion.currentStreak}
                  </AppText>
                </View>
                <AppText variant="section" color={colors.ctaEnd}>
                  {streakDaysLabel(streak)}
                </AppText>
              </View>
            ) : null}
            {completedCount !== null ? (
              <View style={styles.summaryRow}>
                <AppText variant="secondary" color={colors.textSecondary}>
                  {copy.completion.completedActions}
                </AppText>
                <AppText variant="section">{completedCount}</AppText>
              </View>
            ) : null}
          </Card>
        ) : null}

        <View style={styles.actions}>
          <Button
            label={copy.completion.seeProgress}
            variant="primary"
            onPress={handleSeeProgress}
          />
          <Button
            label={copy.completion.seeHistory}
            variant="secondary"
            onPress={handleSeeHistory}
          />
          <Button
            label={copy.completion.close}
            variant="text"
            onPress={handleClose}
          />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  heroSection: {
    alignItems: 'center',
    gap: spacing[2],
    flexShrink: 1,
    position: 'relative',
  },
  burstLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    zIndex: 1,
  },
  illustration: {
    marginTop: spacing[1],
  },
  illustrationCompact: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 0,
  },
  centered: {
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.peach,
    padding: spacing[4],
    gap: spacing[3],
  },
  summaryCardCompact: {
    padding: spacing[3],
    gap: spacing[2],
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  summaryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  actions: {
    gap: spacing[2],
    flexShrink: 0,
  },
});
