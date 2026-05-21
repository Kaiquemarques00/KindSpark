import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useTodayLoop } from '@/features/today/useTodayLoop';

export function TodayScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const {
    suggestion,
    todayDone,
    busy,
    error,
    skipAck,
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
    }, [load]),
  );

  const loading = busy === 'load' && !suggestion;
  const actionDisabled = busy !== null && busy !== 'load';

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.heading, { color: colors.text }]}>Today&apos;s kindness</Text>

      {isOffline ? (
        <Text style={[styles.offlineBanner, { color: colors.muted }]}>
          {pendingSync
            ? 'Offline — your action will sync when you’re back online.'
            : 'Offline — showing your last cached suggestion.'}
        </Text>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color={colors.tint} style={styles.loader} />
      ) : null}

      {!loading && isCompleted ? (
        <View style={[styles.card, { borderColor: colors.tint }]}>
          <Text style={[styles.doneTitle, { color: colors.text }]}>You showed kindness today</Text>
          <Text style={[styles.doneSubtitle, { color: colors.muted }]}>
            Your streak counts for today. Come back tomorrow for a new suggestion.
          </Text>
        </View>
      ) : null}

      {!loading && !isCompleted && suggestion ? (
        <View style={styles.card}>
          <Text style={[styles.category, { color: colors.tint }]}>{suggestion.category}</Text>
          <Text style={[styles.actionTitle, { color: colors.text }]}>{suggestion.title}</Text>
          <Text style={[styles.description, { color: colors.muted }]}>{suggestion.description}</Text>
        </View>
      ) : null}

      {!loading && !isCompleted && !suggestion && !error ? (
        <Text style={[styles.empty, { color: colors.muted }]}>No suggestion available right now.</Text>
      ) : null}

      {skipAck && !isCompleted ? (
        <Text style={[styles.skipHint, { color: colors.muted }]}>
          Skipped — you can try another idea or mark one as done when you&apos;re ready.
        </Text>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !isCompleted && suggestion ? (
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.tint },
              (pressed || actionDisabled) && styles.buttonPressed,
            ]}
            onPress={handleDone}
            disabled={actionDisabled}
          >
            {busy === 'done' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>I did it</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: colors.tint },
              (pressed || actionDisabled) && styles.buttonPressed,
            ]}
            onPress={handleSkip}
            disabled={actionDisabled}
          >
            {busy === 'skip' ? (
              <ActivityIndicator color={colors.tint} />
            ) : (
              <Text style={[styles.secondaryButtonText, { color: colors.tint }]}>Skip</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.linkButton,
              (pressed || actionDisabled) && styles.buttonPressed,
            ]}
            onPress={handleRefresh}
            disabled={actionDisabled}
          >
            {busy === 'refresh' ? (
              <ActivityIndicator color={colors.tint} />
            ) : (
              <Text style={[styles.linkButtonText, { color: colors.tint }]}>Another idea</Text>
            )}
          </Pressable>
        </View>
      ) : null}

      {!loading && isCompleted && todayDone ? (
        <Text style={[styles.completedMeta, { color: colors.muted }]}>
          Logged for {todayDone.action_date}
        </Text>
      ) : null}
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
  heading: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  offlineBanner: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  loader: {
    marginTop: 32,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  doneSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
  },
  skipHint: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  error: {
    color: '#C45C5C',
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  completedMeta: {
    fontSize: 13,
    textAlign: 'center',
  },
});
