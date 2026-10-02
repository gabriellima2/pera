import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useLocalSearchParams, useRouter } from 'expo-router'

export function CheckEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>()
  const router = useRouter()

  return (
    <Box flex={1} px="md" justifyContent="center" gap="xl">
      <Box gap="sm">
        <Text variant="title">Confirme seu e-mail</Text>
        <Text color="foregroundSecondary">
          Enviamos um link de confirmação
          {email ? ` para ${email}` : ''}. Abra o e-mail e confirme sua conta
          antes de entrar.
        </Text>
      </Box>

      <Button
        label="Ir para entrar"
        onPress={() => router.replace('/(auth)/sign-in')}
      />
    </Box>
  )
}
