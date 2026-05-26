import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { hitSlop44 } from '@/components/ui/a11y';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration } from '@/theme/motion';
import { colors, gradient, radius, shadows } from '@/theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion && !isDisabled) {
      scale.value = withTiming(0.98, { duration: duration.fast });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withTiming(1, { duration: duration.fast });
    }
  };

  const content = loading ? (
    <ActivityIndicator
      color={variant === 'primary' ? colors.white : colors.ctaEnd}
      accessibilityLabel="Loading"
    />
  ) : (
    <>
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={variant === 'primary' ? colors.white : colors.ctaEnd}
          style={styles.icon}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : null}
      <AppText
        variant="body"
        color={
          variant === 'primary'
            ? colors.white
            : variant === 'secondary' || variant === 'text'
              ? colors.ctaEnd
              : colors.textPrimary
        }
      >
        {label}
      </AppText>
    </>
  );

  const pressable = (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      hitSlop={hitSlop44}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        !reduceMotion && pressed && !isDisabled && styles.pressedOpacity,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[gradient.cta.start, gradient.cta.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, styles.primaryInner]}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Pressable>
  );

  if (reduceMotion) {
    return pressable;
  }

  return <Animated.View style={animatedStyle}>{pressable}</Animated.View>;
}

const variantStyles = StyleSheet.create({
  primary: {
    minHeight: 48,
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...shadows.cta,
  },
  secondary: {
    minHeight: 48,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.ctaEnd,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  ghost: {
    minHeight: 44,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  text: {
    minHeight: 44,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
  },
  gradient: {
    flex: 1,
  },
  primaryInner: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    marginRight: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  pressedOpacity: {
    opacity: 0.92,
  },
});
