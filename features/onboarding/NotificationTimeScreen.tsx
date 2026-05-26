import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenShell } from '@/components/ui/ScreenShell';
import { copy } from '@/constants/copy';
import { useAppSession } from '@/features/auth';
import { saveNotificationPreferences } from '@/features/onboarding/preferences-api';
import { trackEvent } from '@/lib/analytics';
import {
  formatNotificationTime,
  requestNotificationPermissions,
  scheduleDailyReminder,
} from '@/lib/notifications';
import { colors, radius, spacing } from '@/theme/tokens';

const DEFAULT_REMINDER = new Date(2020, 0, 1, 9, 0);

export function NotificationTimeScreen() {
  const router = useRouter();
  const { session, refreshAppState } = useAppSession();

  const [time, setTime] = useState(DEFAULT_REMINDER);
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!session?.user) {
      setError(copy.onboarding.signInRequired);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const notificationTime = formatNotificationTime(time);
      await saveNotificationPreferences(session.user.id, notificationTime, true);

      const granted = await requestNotificationPermissions();
      if (!granted) {
        setError(copy.onboarding.notificationsDenied);
        setLoading(false);
        return;
      }

      await scheduleDailyReminder(notificationTime, true);
      trackEvent('onboarding_completed', { notification_time: notificationTime });
      trackEvent('notification_enabled', { notification_time: notificationTime });
      await refreshAppState();
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.onboarding.savePreferencesError);
    } finally {
      setLoading(false);
    }
  };

  const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ScreenShell contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <AppText variant="title" style={styles.centered}>
          {copy.onboarding.notificationTimeTitle}
        </AppText>
        <AppText variant="bodySecondary" style={styles.centered}>
          {copy.onboarding.notificationTimeSubtitle}
        </AppText>
      </View>

      {Platform.OS === 'android' && (
        <Pressable
          style={styles.timeButton}
          onPress={() => setShowPicker(true)}
          accessibilityRole="button"
          accessibilityLabel={`Reminder time, ${timeLabel}`}
        >
          <AppText variant="section" color={colors.ctaEnd}>
            {timeLabel}
          </AppText>
        </Pressable>
      )}

      {showPicker ? (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_event, selected) => {
            if (Platform.OS === 'android') setShowPicker(false);
            if (selected) setTime(selected);
          }}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <AppText variant="caption" style={styles.centered}>
          {copy.onboarding.notificationTimeSelected}: {timeLabel}
        </AppText>
      ) : null}

      {error ? (
        <AppText variant="caption" color={colors.warning} style={styles.centered}>
          {error}
        </AppText>
      ) : null}

      <Button
        label={copy.onboarding.saveTime}
        variant="primary"
        onPress={handleContinue}
        loading={loading}
        disabled={loading}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing[4],
  },
  header: {
    gap: spacing[3],
  },
  centered: {
    textAlign: 'center',
  },
  timeButton: {
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: colors.ctaEnd,
    borderRadius: radius.input,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
  },
});
