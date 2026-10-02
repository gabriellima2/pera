import { LoadingScreen } from '@/components/ui/loading'
import { queryClient } from '@/lib/react-query/client'
import { AUTH_REDIRECT_URL } from '@/lib/supabase/auth-config'
import {
  bindSupabaseAuthRefreshToAppState,
  supabaseClient,
} from '@/lib/supabase/client'
import { handleSupabaseAuthRedirect } from '@/lib/supabase/handle-auth-redirect'
import type { AuthError, Session } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type AuthContextValue = {
  session: Session | null
  isLoading: boolean

  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>
  signUpWithEmail: (input: {
    email: string
    password: string
    name: string
  }) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribeAppState = bindSupabaseAuthRefreshToAppState()

    const onUrl = ({ url }: { url: string }) => {
      void handleSupabaseAuthRedirect(url)
    }

    void Linking.getInitialURL().then((url) => {
      if (url) {
        void handleSupabaseAuthRedirect(url)
      }
    })

    const urlSubscription = Linking.addEventListener('url', onUrl)

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
      urlSubscription.remove()
      unsubscribeAppState()
    }
  }, [])

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    },
    [],
  )

  const signUpWithEmail = useCallback(
    async (input: { email: string; password: string; name: string }) => {
      const { error } = await supabaseClient.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { name: input.name },
        },
      })
      return { error }
    },
    [],
  )

  const signOut = useCallback(async () => {
    await supabaseClient.auth.signOut({ scope: 'local' })
    queryClient.clear()
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: AUTH_REDIRECT_URL,
    })
    return { error }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabaseClient.auth.updateUser({ password })
    return { error }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,

      signInWithEmail,
      signUpWithEmail,
      signOut,
      requestPasswordReset,
      updatePassword,
    }),
    [
      session,
      isLoading,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      requestPasswordReset,
      updatePassword,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  )
}
