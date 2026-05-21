import { Link } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type AuthFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  footerHref: string;
  footerLabel: string;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
};

export function AuthForm({
  title,
  subtitle,
  submitLabel,
  footerHref,
  footerLabel,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
  error,
}: AuthFormProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>

      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.tabIconDefault, backgroundColor: colors.background },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.muted}
        value={email}
        onChangeText={onEmailChange}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        editable={!loading}
      />
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.tabIconDefault, backgroundColor: colors.background },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.muted}
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        autoCapitalize="none"
        textContentType="password"
        editable={!loading}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.tint },
          (pressed || loading) && styles.buttonPressed,
        ]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{submitLabel}</Text>
        )}
      </Pressable>

      <Link href={footerHref as never} asChild>
        <Pressable style={styles.footerLink}>
          <Text style={[styles.footerText, { color: colors.tint }]}>{footerLabel}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
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
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    color: '#C45C5C',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLink: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
