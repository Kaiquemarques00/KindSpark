import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAppSession } from '@/features/auth';
import { useSettings } from '@/features/settings/useSettings';

export function SettingsScreen() {
  const { signOut } = useAppSession();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const {
    time,
    setTime,
    enabled,
    setEnabled,
    busy,
    saving,
    error,
    saved,
    load,
    save,
  } = useSettings();

  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [signingOut, setSigningOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      {busy ? (
        <ActivityIndicator size="large" color={colors.tint} style={styles.loader} />
      ) : null}

      {!busy ? (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily reminder</Text>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>Notifications</Text>
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                trackColor={{ false: '#ccc', true: colors.tint }}
              />
            </View>

            {enabled ? (
              <>
                {Platform.OS === 'android' && (
                  <Pressable
                    style={[styles.timeButton, { borderColor: colors.tint }]}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={[styles.timeButtonText, { color: colors.tint }]}>
                      {timeLabel}
                    </Text>
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
                  <Text style={[styles.hint, { color: colors.muted }]}>
                    Reminder time: {timeLabel}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text style={[styles.hint, { color: colors.muted }]}>
                Reminders are off. You can still open the app anytime.
              </Text>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.tint },
              (pressed || saving) && styles.buttonPressed,
            ]}
            onPress={save}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Save changes</Text>
            )}
          </Pressable>

          {saved ? (
            <Text style={[styles.saved, { color: colors.tint }]}>Settings saved.</Text>
          ) : null}
        </>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          styles.secondaryButton,
          { borderColor: colors.tint },
          (pressed || signingOut) && styles.buttonPressed,
        ]}
        onPress={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? (
          <ActivityIndicator color={colors.tint} />
        ) : (
          <Text style={[styles.secondaryButtonText, { color: colors.tint }]}>Sign out</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  loader: {
    marginTop: 24,
  },
  section: {
    gap: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: 16,
  },
  timeButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  timeButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  saved: {
    fontSize: 14,
    textAlign: 'center',
  },
  error: {
    color: '#C45C5C',
    fontSize: 14,
    textAlign: 'center',
  },
});
