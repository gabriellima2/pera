import { useAuth } from '@/contexts/auth-context'
import { Redirect } from 'expo-router'

export default function Index() {
  const { session } = useAuth()

  if (session) {
    return <Redirect href="/(private)/(tabs)/(daily-entries)" />
  }

  return <Redirect href="/(auth)/sign-in" />
}
