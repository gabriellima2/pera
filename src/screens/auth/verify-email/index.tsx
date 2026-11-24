import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/contexts/auth-context'
import { getAuthErrorMessage } from '@/lib/supabase/auth-errors'
import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { toast } from 'sonner-native'

export function VerifyEmailScreen() {
  const { session, resendSignupConfirmation, refreshSession, signOut } =
    useAuth()
  const [isResending, setIsResending] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void refreshSession()
      }
    })

    return () => subscription.remove()
  }, [refreshSession])

  const email = session?.user.email ?? ''

  async function handleResend() {
    setIsResending(true)
    const { error } = await resendSignupConfirmation()
    setIsResending(false)

    if (error) {
      toast.error(getAuthErrorMessage(error))
      return
    }

    toast.success('E-mail de confirmação reenviado')
  }

  async function handleAlreadyConfirmed() {
    setIsRefreshing(true)
    const { error, verified } = await refreshSession()
    setIsRefreshing(false)

    if (error) {
      toast.error(getAuthErrorMessage(error))
      return
    }

    if (!verified) {
      toast.info(
        'Ainda não detectamos a confirmação. Tente novamente em instantes.',
      )
    }
  }

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
          onPress={handleResend}
        />
        <Button
          label="Já confirmei"
          loading={isRefreshing}
          onPress={handleAlreadyConfirmed}
        />
        <Button label="Sair" variant="ghost" onPress={handleSignOut} />
      </Box>
    </Box>
  )
}
