import { useRouter } from 'expo-router';
import { useState } from 'react';

import { AuthForm } from '@/components/AuthForm';
import { signUpWithEmail, useAppSession } from '@/features/auth';

function mapAuthError(message: string): string {
  if (message.toLowerCase().includes('already registered')) {
    return 'This email is already registered. Sign in instead.';
  }
  if (message.toLowerCase().includes('password')) {
    return 'Use a password with at least 6 characters.';
  }
  return message;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { refreshAppState } = useAppSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Use a password with at least 6 characters.');
      return;
    }

    setLoading(true);
    let session = null;
    let authError = null;
    try {
      const result = await signUpWithEmail(trimmedEmail, password);
      session = result.session;
      authError = result.error;
    } catch (e) {
      setLoading(false);
      setError(e instanceof Error ? e.message : 'Registration failed. Try again.');
      return;
    }
    setLoading(false);

    if (authError) {
      setError(mapAuthError(authError.message));
      return;
    }

    if (!session) {
      setError('Check your email to confirm your account, then sign in.');
      return;
    }

    await refreshAppState();
    router.replace('/');
  };

  return (
    <AuthForm
      title="Join KindSpark"
      subtitle="A simple daily habit of kindness."
      submitLabel="Create account"
      footerHref="/(auth)/login"
      footerLabel="Already have an account?"
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
