import { useAuth } from '@/contexts/auth-context'
import { isEmailVerified } from '@/lib/supabase/email-verified'
import { Redirect } from 'expo-router'

export default function Index() {
  const { session } = useAuth()

  if (session) {
    if (!isEmailVerified(session)) {
      return <Redirect href="/verify-email" />
    }

    return <Redirect href="/(private)/(tabs)/(daily-entries)" />
  }

  return <Redirect href="/(auth)/sign-in" />
}
