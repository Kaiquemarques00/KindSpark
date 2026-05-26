import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/theme/tokens';

export type IllustrationSize = 'onboarding' | 'card' | 'empty';

type IllustrationProps = {
  /** When omitted, shows `placeholderIcon` on the peach surface (preferred until final art). */
  source?: ImageSourcePropType;
  size?: IllustrationSize;
  placeholderIcon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

const sizeStyles: Record<IllustrationSize, { box: ViewStyle; image: ImageStyle }> = {
  onboarding: {
    box: { width: 240, height: 240, borderRadius: 120 },
    image: { width: '75%', height: '75%' },
  },
  card: {
    box: { width: '100%', height: '100%' },
    image: { width: '80%', height: '80%' },
  },
  empty: {
    box: { width: 160, height: 160, borderRadius: 80 },
    image: { width: '70%', height: '70%' },
  },
};

export function Illustration({
  source,
  size = 'onboarding',
  placeholderIcon = 'heart',
  accessibilityLabel,
  style,
}: IllustrationProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPlaceholder = !source || imageFailed;
  const dimensions = sizeStyles[size];

  return (
    <View
      style={[styles.container, dimensions.box, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    >
      {showPlaceholder ? (
        <View style={styles.placeholderInner}>
          <Ionicons
            name={placeholderIcon}
            size={size === 'onboarding' ? 48 : size === 'empty' ? 40 : 56}
            color={colors.ctaEnd}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </View>
      ) : (
        <Image
          source={source}
          style={[styles.image, dimensions.image]}
          resizeMode="contain"
          onError={() => setImageFailed(true)}
          accessibilityIgnoresInvertColors
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholderInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
  },
});
