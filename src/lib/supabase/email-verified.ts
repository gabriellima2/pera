import type { Session } from '@supabase/supabase-js'

export function isEmailVerified(session: Session | null): boolean {
  return Boolean(session?.user.email_confirmed_at)
}
