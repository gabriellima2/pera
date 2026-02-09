import { supabaseClient } from '@/lib/supabase/client'
import { Link, useRouter } from 'expo-router'
import { useEffect } from 'react'

export default function Screen() {
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        const session = await supabaseClient.auth.getSession()

        if (session.error) {
          console.error(session.error)
          return
        }

        if (session.data.session) {
          router.replace('/create-daily-entry')
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

        router.replace('/create-daily-entry')
      } catch (error) {
        console.error(error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Link href="/create-daily-entry">Create Daily Entry</Link>
}
