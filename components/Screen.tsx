import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type ScreenProps = {
  title: string;
  subtitle?: string;
  links?: { href: string; label: string }[];
};

export function Screen({ title, subtitle, links }: ScreenProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>
      ) : null}
      {links?.map((link) => (
        <Link key={link.href} href={link.href as never} asChild>
          <Pressable style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}>
            <Text style={[styles.linkText, { color: colors.tint }]}>{link.label}</Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  link: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  linkPressed: {
    opacity: 0.6,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
