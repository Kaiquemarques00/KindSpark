import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenShell } from '@/components/ui/ScreenShell';
import { copy } from '@/constants/copy';

/** Stub for RUI-T-010 — full layout in RUI-T-030. */
export function WelcomeScreen() {
  return (
    <ScreenShell contentContainerStyle={styles.container}>
      <View style={styles.logoArea}>
        <AppText variant="hero" style={styles.centered}>
          {copy.brand.name}
        </AppText>
      </View>
      <AppText variant="bodySecondary" style={styles.centered}>
        {copy.onboarding.welcomeSubtitle}
      </AppText>
      <View style={styles.spacer} />
      <Button label={copy.onboarding.getStarted} variant="primary" />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoArea: {
    marginTop: 48,
  },
  centered: {
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
});
