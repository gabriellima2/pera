import {
  Screen,
  ScreenActions,
  ScreenDescription,
  ScreenHeading,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { toast } from 'sonner-native'

export function VerifyEmailScreen() {
  const { session, resendSignupConfirmation, refreshSession, signOut } =
    useAuth()

  const { mutateAsync: resendConfirmation, isPending: isResending } =
    useMutation({
      mutationFn: resendSignupConfirmation,
      onSuccess: () => {
        toast.success('E-mail de confirmação reenviado')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const { mutateAsync: refreshSessionMutation, isPending: isRefreshing } =
    useMutation({
      mutationFn: refreshSession,
      onSuccess: ({ verified }) => {
        if (!verified) {
          toast.info(
            'Ainda não detectamos a confirmação. Tente novamente em instantes.',
          )
        }
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void refreshSession().catch(() => {})
      }
    })

    return () => subscription.remove()
  }, [refreshSession])

  const email = session?.user.email ?? ''

  const confirmationLink = email
    ? `enviado para ${email}`
    : 'no link que enviamos'

  return (
    <Screen>
      <ScreenHeading>
        <ScreenTitle>Confirme seu e-mail</ScreenTitle>
        <ScreenDescription>
          {`Para usar o Pera, abra o link de confirmação ${confirmationLink}. Depois, toque em "Já confirmei". Não encontrou? Confira a pasta de spam do seu e-mail, ou aguarde alguns minutos.`}
        </ScreenDescription>
      </ScreenHeading>

      <ScreenActions>
        <Button
          label="Reenviar e-mail"
          variant="secondary"
          loading={isResending}
          onPress={() => void resendConfirmation()}
        />
        <Button
          label="Já confirmei"
          loading={isRefreshing}
          onPress={() => void refreshSessionMutation()}
        />
        <Button label="Sair" variant="ghost" onPress={() => void signOut()} />
      </ScreenActions>
    </Screen>
  )
}
