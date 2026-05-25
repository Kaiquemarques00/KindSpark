import { useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { colors, spacing } from '@/theme/tokens';

type ActionCardProps = {
  title: string;
  description: string;
  illustrationSource?: ImageSourcePropType;
};

export function ActionCard({ title, description, illustrationSource }: ActionCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPlaceholder = !illustrationSource || imageFailed;

  return (
    <Card style={styles.card}>
      <View style={styles.illustrationArea}>
        {showPlaceholder ? (
          <View style={styles.placeholder} accessibilityLabel="Illustration placeholder" />
        ) : (
          <Image
            source={illustrationSource}
            style={styles.illustration}
            resizeMode="contain"
            onError={() => setImageFailed(true)}
            accessibilityIgnoresInvertColors
          />
        )}
      </View>
      <View style={styles.body}>
        <AppText variant="cardTitle" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="bodySecondary">{description}</AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  illustrationArea: {
    height: 180,
    backgroundColor: colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: '80%',
    height: '80%',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.peach,
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  title: {
    marginBottom: 4,
  },
});
