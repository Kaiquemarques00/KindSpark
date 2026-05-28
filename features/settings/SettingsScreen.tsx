import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Switch, View } from 'react-native';

import { AppText, Button, ListRow, ScreenShell } from '@/components/ui';
import { copy } from '@/constants/copy';
import { useAppSession } from '@/features/auth';
import { useSettings } from '@/features/settings/useSettings';
import { colors, spacing } from '@/theme/tokens';

const TAB_BAR_INSET = 96;

export function SettingsScreen() {
  const { signOut } = useAppSession();
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
    <ScreenShell
      scrollable
      contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_INSET }]}
    >
      <AppText variant="title">{copy.settings.title}</AppText>

      {busy ? (
        <ActivityIndicator size="large" color={colors.ctaEnd} style={styles.loader} />
      ) : null}

      {!busy ? (
        <>
          <AppText variant="section">{copy.settings.dailyReminder}</AppText>

          <ListRow
            icon="notifications-outline"
            label={copy.settings.notifications}
            value={enabled ? copy.settings.on : copy.settings.off}
            rightElement={
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                trackColor={{ false: colors.textMuted, true: colors.ctaEnd }}
                thumbColor={colors.card}
              />
            }
          />

          {enabled ? (
            <>
              <ListRow
                icon="time-outline"
                label={copy.settings.reminderTime}
                value={timeLabel}
                showChevron
                onPress={Platform.OS === 'android' ? () => setShowPicker(true) : undefined}
              />
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
            </>
          ) : (
            <AppText variant="secondary" color={colors.textMuted}>
              {copy.settings.remindersOff}
            </AppText>
          )}

          <View style={styles.section}>
            <ListRow icon="volume-medium-outline" label={copy.settings.sound} showChevron />
            <ListRow icon="phone-portrait-outline" label={copy.settings.vibration} showChevron />
          </View>

          <View style={styles.section}>
            <ListRow icon="shield-outline" label={copy.settings.privacy} showChevron />
            <ListRow icon="document-text-outline" label={copy.settings.terms} showChevron />
            <ListRow icon="information-circle-outline" label={copy.settings.about} showChevron />
            <ListRow icon="star-outline" label={copy.settings.rateApp} showChevron />
          </View>

          <Button
            label={copy.settings.saveChanges}
            variant="secondary"
            onPress={save}
            loading={saving}
            disabled={saving}
          />

          {saved ? (
            <AppText variant="caption" color={colors.success} style={styles.centered}>
              {copy.settings.saved}
            </AppText>
          ) : null}
        </>
      ) : null}

      {error ? (
        <AppText variant="caption" color={colors.warning} style={styles.centered}>
          {error}
        </AppText>
      ) : null}

      <Button
        label={copy.settings.signOut}
        variant="ghost"
        onPress={handleSignOut}
        loading={signingOut}
        disabled={signingOut}
        style={styles.signOut}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[3],
  },
  loader: {
    marginVertical: spacing[4],
  },
  section: {
    marginTop: spacing[2],
  },
  centered: {
    textAlign: 'center',
  },
  signOut: {
    marginTop: spacing[0],
    marginBottom: spacing[6],
  },
});
