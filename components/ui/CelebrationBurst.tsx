import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration } from '@/theme/motion';
import { colors } from '@/theme/tokens';

const PARTICLE_COUNT = 10;

const PARTICLE_COLORS = [
  colors.peach,
  colors.ctaStart,
  colors.accentGreen,
  colors.accentYellow,
  colors.ctaEnd,
] as const;

type ParticleConfig = {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
};

const PARTICLES: ParticleConfig[] = Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
  x: ((index % 5) - 2) * 16 + (index % 3) * 6,
  y: -24 - (index % 4) * 14,
  size: 6 + (index % 3) * 2,
  color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
  delay: (index * 35) % 120,
}));

type CelebrationBurstProps = {
  active?: boolean;
};

function Particle({ x, y, size, color, delay }: ParticleConfig) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration: duration.celebration }));
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateX: x * progress.value }, { translateY: y * progress.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

function ReducedMotionFade() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0.25, { duration: duration.fast }),
      withTiming(0, { duration: duration.fast }),
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.fadeOverlay, animatedStyle]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

export function CelebrationBurst({ active = true }: CelebrationBurstProps) {
  const reduceMotion = useReducedMotion();

  if (!active) {
    return null;
  }

  if (reduceMotion) {
    return <ReducedMotionFade />;
  }

  return (
    <View style={styles.host} pointerEvents="none">
      {PARTICLES.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    height: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  particle: {
    position: 'absolute',
  },
  fadeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.peach,
  },
});
