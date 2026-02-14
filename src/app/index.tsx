import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { supabaseClient } from '@/lib/supabase/client'
import { Link } from 'expo-router'
import { useEffect } from 'react'

export default function Screen() {
  useEffect(() => {
    ;(async () => {
      try {
        const session = await supabaseClient.auth.getSession()

        if (session.error) {
          console.error(session.error)
          return
        }

        if (session.data.session) {
          return
        }

        const auth = await supabaseClient.auth.signInWithPassword({
          email: process.env.EXPO_PUBLIC_DEV_LOGIN_EMAIL!,
          password: process.env.EXPO_PUBLIC_DEV_LOGIN_PWD!,
        })

        if (auth.error) {
          console.error('Error signing in:', auth.error)
          return {
            success: false,
          }
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Link href="/(tabs)">
        <Text>Go to Home</Text>
      </Link>
      <Link href="/(tabs)/moment-entries">
        <Text>Go to Moment Entries</Text>
      </Link>
    </Box>
  )
}
