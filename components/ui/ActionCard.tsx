import { StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Illustration } from '@/components/ui/Illustration';
import { getCategoryVisual } from '@/lib/illustrations';
import { spacing } from '@/theme/tokens';

type ActionCardProps = {
  title: string;
  description: string;
  category?: string | null;
  /** Optional per-action art; omit to use category icon until assets exist. */
  illustrationSource?: ImageSourcePropType;
};

export function ActionCard({
  title,
  description,
  category,
  illustrationSource,
}: ActionCardProps) {
  const { icon, label } = getCategoryVisual(category);

  return (
    <Card style={styles.card}>
      <View style={styles.illustrationArea}>
        <Illustration
          source={illustrationSource}
          size="card"
          placeholderIcon={icon}
          accessibilityLabel={`${label} action illustration`}
        />
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
