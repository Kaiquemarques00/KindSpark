import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/tokens';

export function AdBannerShell() {
  return (
    <View style={styles.banner} accessibilityLabel="Advertisement placeholder">
      <AppText variant="micro" color={colors.textMuted}>
        Ad
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 50,
    backgroundColor: 'rgba(154, 154, 154, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 8,
  },
});
