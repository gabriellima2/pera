import {
  Screen,
  ScreenBody,
  ScreenDescription,
  ScreenHeader,
  ScreenHeading,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { Button } from '@/components/ui/button'
import { PressableFeedback } from '@/components/ui/pressable-feedback'
import { Text } from '@/components/ui/text'
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
      mutationFn: () => resendSignupConfirmation(),
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

  const email = session?.user.email
  const destination = email ? `para ${email}` : 'para o seu e-mail'

  return (
    <Screen>
      <ScreenHeader>
        <PressableFeedback onPress={() => void signOut()}>
          <Text>Sair da conta</Text>
        </PressableFeedback>
      </ScreenHeader>
      <ScreenBody>
        <ScreenHeading flex={1} justifyContent="center" alignItems="center">
          <ScreenTitle textAlign="center">Confirme seu e-mail</ScreenTitle>
          <ScreenDescription textAlign="center">
            {`O link de confirmação foi enviado ${destination}. Abra o e-mail e toque no link para abrir o Pera e ativar sua conta. Não achou o e-mail? Confira o spam ou aguarde alguns minutos.`}
          </ScreenDescription>
        </ScreenHeading>

        <Button
          label="Já confirmei"
          loading={isRefreshing}
          onPress={() => void refreshSessionMutation()}
        />
        <Button
          label="Reenviar e-mail"
          variant="secondary"
          loading={isResending}
          onPress={() => void resendConfirmation()}
        />
      </ScreenBody>
    </Screen>
  )
}
