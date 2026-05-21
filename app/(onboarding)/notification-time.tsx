import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAppSession } from '@/features/auth';
import { saveNotificationPreferences } from '@/features/onboarding';
import {
  formatNotificationTime,
  requestNotificationPermissions,
  scheduleDailyReminder,
} from '@/lib/notifications';

const DEFAULT_REMINDER = new Date(2020, 0, 1, 9, 0);

export default function NotificationTimeScreen() {
  const router = useRouter();
  const { session, refreshAppState } = useAppSession();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [time, setTime] = useState(DEFAULT_REMINDER);
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!session?.user) {
      setError('You need to be signed in.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const notificationTime = formatNotificationTime(time);
      await saveNotificationPreferences(session.user.id, notificationTime, true);

      const granted = await requestNotificationPermissions();
      if (!granted) {
        setError('Enable notifications in system settings to get daily reminders.');
        setLoading(false);
        return;
      }

      await scheduleDailyReminder(notificationTime, true);
      await refreshAppState();
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your preferences.');
    } finally {
      setLoading(false);
    }
  };

  const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>When should we remind you?</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Pick a time for your daily kindness nudge. You can change this later in Settings.
      </Text>

      {Platform.OS === 'android' && (
        <Pressable
          style={[styles.timeButton, { borderColor: colors.tint }]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={[styles.timeButtonText, { color: colors.tint }]}>{timeLabel}</Text>
        </Pressable>
      )}

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_event, selected) => {
            if (Platform.OS === 'android') setShowPicker(false);
            if (selected) setTime(selected);
          }}
        />
      )}

      {Platform.OS === 'ios' ? (
        <Text style={[styles.timeHint, { color: colors.muted }]}>Selected: {timeLabel}</Text>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.tint },
          (pressed || loading) && styles.buttonPressed,
        ]}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  timeButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  timeButtonText: {
    fontSize: 22,
    fontWeight: '600',
  },
  timeHint: {
    textAlign: 'center',
    fontSize: 15,
  },
  error: {
    color: '#C45C5C',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
