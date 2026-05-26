import type { Session } from '@supabase/supabase-js';

/** First name or email local-part for Today greeting (RUI-TD-01). */
export function getDisplayName(session: Session | null): string {
  if (!session?.user) return 'friend';

  const meta = session.user.user_metadata;
  const fullName = meta?.full_name ?? meta?.name;
  if (typeof fullName === 'string' && fullName.trim()) {
    return fullName.trim().split(/\s+/)[0] ?? 'friend';
  }

  const email = session.user.email;
  if (email) {
    return email.split('@')[0] ?? 'friend';
  }

  return 'friend';
}
