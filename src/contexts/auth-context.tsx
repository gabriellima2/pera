import { LoadingScreen } from '@/components/ui/loading'
import { queryClient } from '@/lib/react-query/client'
import { AUTH_REDIRECT_URL } from '@/lib/supabase/auth-config'
import { throwAuthError } from '@/lib/supabase/auth-errors'
import {
  bindSupabaseAuthRefreshToAppState,
  supabaseClient,
} from '@/lib/supabase/client'
import { isEmailVerified } from '@/lib/supabase/email-verified'
import { handleSupabaseAuthRedirect } from '@/lib/supabase/handle-auth-redirect'
import type { Session } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { SignInInput, SignUpInput } from '@/@types/auth'

export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
  nonce?: string
}

type AuthContextValue = {
  session: Session | null
  isLoading: boolean
  signIn: (input: SignInInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<void>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  changePassword: (input: ChangePasswordInput) => Promise<void>
  requestPasswordChangeReauthentication: () => Promise<void>
  resendSignupConfirmation: () => Promise<void>
  refreshSession: () => Promise<{ verified: boolean }>
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

  const signIn = useCallback(async (input: SignInInput) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    if (error) {
      throwAuthError(error)
    }
  }, [])

  const signUp = useCallback(async (input: SignUpInput) => {
    const { error } = await supabaseClient.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { name: input.name },
      },
    })

    if (error) {
      throwAuthError(error)
    }
  }, [])

  const signOut = useCallback(async () => {
    await supabaseClient.auth.signOut({ scope: 'local' })
    queryClient.clear()
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: AUTH_REDIRECT_URL,
    })

    if (error) {
      throwAuthError(error)
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabaseClient.auth.updateUser({ password })

    if (error) {
      throwAuthError(error)
    }
  }, [])

  const changePassword = useCallback(async (input: ChangePasswordInput) => {
    const { error } = await supabaseClient.auth.updateUser({
      password: input.newPassword,
      current_password: input.currentPassword,
      ...(input.nonce ? { nonce: input.nonce } : {}),
    })

    if (error) {
      throwAuthError(error)
    }
  }, [])

  const requestPasswordChangeReauthentication = useCallback(async () => {
    const { error } = await supabaseClient.auth.reauthenticate()

    if (error) {
      throwAuthError(error)
    }
  }, [])

  const resendSignupConfirmation = useCallback(async () => {
    const email = session?.user.email
    if (!email) {
      throw new Error('Não foi possível identificar o e-mail da sessão.')
    }

    const { error } = await supabaseClient.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      throwAuthError(error)
    }
  }, [session?.user.email])

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabaseClient.auth.refreshSession()

    if (error) {
      throwAuthError(error)
    }

    return {
      verified: isEmailVerified(data.session),
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,

      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      changePassword,
      requestPasswordChangeReauthentication,
      resendSignupConfirmation,
      refreshSession,
    }),
    [
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      changePassword,
      requestPasswordChangeReauthentication,
      resendSignupConfirmation,
      refreshSession,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  )
}
