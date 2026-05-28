import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingScreen } from '@/components/LoadingScreen';
import { copy } from '@/constants/copy';
import { useAppSession } from '@/features/auth';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration } from '@/theme/motion';
import { colors, radius, shadows } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type TabBarIconProps = {
  focused: boolean;
  color: string;
  outline: IoniconName;
  filled: IoniconName;
};

function TabBarIcon({ focused, color, outline, filled }: TabBarIconProps) {
  const reduceMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      return {
        transform: [{ scale: 1 }],
        opacity: focused ? 1 : 0.85,
      };
    }
    return {
      transform: [{ scale: withTiming(focused ? 1 : 0.92, { duration: duration.default }) }],
      opacity: withTiming(focused ? 1 : 0.85, { duration: duration.default }),
    };
  }, [focused, reduceMotion]);

  if (reduceMotion) {
    return (
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ionicons name={focused ? filled : outline} size={24} color={color} />
      </View>
    );
  }

  return (
    <Animated.View style={animatedStyle} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Ionicons name={focused ? filled : outline} size={24} color={color} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const { session, authLoading, onboardingComplete } = useAppSession();
  const reduceMotion = useReducedMotion();
  const transitionDuration = reduceMotion ? 0 : duration.default;
  const insets = useSafeAreaInsets();
  const androidBottomInset = Platform.OS === 'android' ? insets.bottom : 0;

  if (authLoading || (session && onboardingComplete === null)) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ctaEnd,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [
          styles.tabBar,
          androidBottomInset
            ? {
                paddingBottom: 8 + androidBottomInset,
                height: 68 + androidBottomInset,
              }
            : { paddingBottom: 8 },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
        sceneStyle: { backgroundColor: colors.background },
        animation: reduceMotion ? 'none' : 'fade',
        transitionSpec: {
          animation: 'timing',
          config: { duration: transitionDuration },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: copy.tabs.today,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} color={color} outline="sunny-outline" filled="sunny" />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: copy.tabs.progress,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              outline="stats-chart-outline"
              filled="stats-chart"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: copy.tabs.history,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} color={color} outline="time-outline" filled="time" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: copy.tabs.settings,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              outline="settings-outline"
              filled="settings"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.primary,
    borderTopRightRadius: radius.primary,
    borderTopWidth: 0,
    paddingTop: 8,
    height: Platform.select({ ios: 88, default: 68 }),
    ...shadows.card,
    elevation: 12,
  },
  tabBarLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
});
