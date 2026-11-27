import { LoadingScreen } from '@/components/ui/loading'
import { AUTH_REDIRECT_URL } from '@/lib/supabase/auth-config'
import { isPassableAuthError, throwAuthError } from '@/lib/supabase/auth-errors'
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
import { useQueryClient } from '@tanstack/react-query'

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
  requestReauthentication: () => Promise<void>
  resendSignupConfirmation: (email?: string) => Promise<void>
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
  const queryClient = useQueryClient()

  useEffect(() => {
    // Ignore async completion after AuthProvider unmount; UI updates use applySession / finishBootstrap.
    let cancelled = false

    const applySession = (next: Session | null) => {
      if (!cancelled) setSession(next)
    }

    const finishBootstrap = () => {
      if (!cancelled) setIsLoading(false)
    }

    const unsubscribeAppState = bindSupabaseAuthRefreshToAppState()

    // Sync React from GoTrue; must stay enabled during cold start (INITIAL_SESSION, deeplink).
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession)
    })

    const onUrl = ({ url }: { url: string }) => {
      // Warm deeplinks: handler updates storage; listener owns React state.
      void (async () => {
        await handleSupabaseAuthRedirect(url)
      })()
    }

    const urlSubscription = Linking.addEventListener('url', onUrl)

    async function bootstrap() {
      try {
        // Apply cold-start deeplink tokens before validating storage (avoids URL ∥ initAuth race).
        const initialUrl = await Linking.getInitialURL()
        if (initialUrl) {
          if (cancelled) return
          await handleSupabaseAuthRedirect(initialUrl)
        }

        if (cancelled) return

        const {
          data: { session: persisted },
        } = await supabaseClient.auth.getSession()

        if (persisted) {
          const { error } = await supabaseClient.auth.getUser()
          if (cancelled) return

          if (error) {
            if (isPassableAuthError(error)) {
              applySession(persisted)
            } else {
              await supabaseClient.auth.signOut({ scope: 'local' })
              queryClient.clear()
              applySession(null)
            }
          } else {
            const {
              data: { session: current },
            } = await supabaseClient.auth.getSession()
            // getUser may refresh user claims in storage; React state can still be stale.
            applySession(current ?? persisted)
          }
        } else {
          applySession(null)
        }
      } finally {
        finishBootstrap()
      }
    }

    void bootstrap()

    return () => {
      // Set before unsubscribing so late callbacks skip setState.
      cancelled = true
      subscription.unsubscribe()
      urlSubscription.remove()
      unsubscribeAppState()
    }
  }, [queryClient])

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
    const { error } = await supabaseClient.auth.signOut({ scope: 'local' })

    if (error) {
      throwAuthError(error)
    }

    queryClient.clear()
  }, [queryClient])

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

  const requestReauthentication = useCallback(async () => {
    const { error } = await supabaseClient.auth.reauthenticate()

    if (error) {
      throwAuthError(error)
    }
  }, [])

  const resendSignupConfirmation = useCallback(
    async (signupEmail?: string) => {
      const email = signupEmail ?? session?.user.email
      if (!email) {
        throw new Error('Não foi possível identificar o e-mail para reenvio.')
      }

      const { error } = await supabaseClient.auth.resend({
        type: 'signup',
        email,
      })

      if (error) {
        throwAuthError(error)
      }
    },
    [session?.user.email],
  )

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
      requestReauthentication,
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
      requestReauthentication,
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
