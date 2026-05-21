import { useRouter } from 'expo-router';
import { useState } from 'react';

import { AuthForm } from '@/components/AuthForm';
import { signInWithEmail, useAppSession } from '@/features/auth';

function mapAuthError(message: string): string {
  if (message.toLowerCase().includes('invalid login')) {
    return 'Email or password is incorrect.';
  }
  return message;
}

export default function LoginScreen() {
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

    setLoading(true);
    const { session, error: authError } = await signInWithEmail(trimmedEmail, password);
    setLoading(false);

    if (authError) {
      setError(mapAuthError(authError.message));
      return;
    }

    if (!session) {
      setError('Sign-in failed. Try again.');
      return;
    }

    await refreshAppState();
    router.replace('/');
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to see today's kindness suggestion."
      submitLabel="Sign in"
      footerHref="/(auth)/register"
      footerLabel="Create an account"
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
