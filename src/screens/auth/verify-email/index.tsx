import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
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

  async function handleSignOut() {
    await signOut()
  }

  return (
    <Box flex={1} px="md" justifyContent="center" gap="xl">
      <Box gap="sm">
        <Text variant="title">Confirme seu e-mail</Text>
        <Text color="foregroundSecondary">
          Para usar o app, confirme o endereço
          {email ? ` ${email}` : ''} pelo link que enviamos. Depois toque em
          &quot;Já confirmei&quot;.
        </Text>
      </Box>

      <Box gap="md">
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
        <Button label="Sair" variant="ghost" onPress={handleSignOut} />
      </Box>
    </Box>
  )
}
