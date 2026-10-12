import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Link } from 'expo-router'
import { SignInForm } from './sign-in-form'

export function SignInScreen() {
  return (
    <Box flex={1} px="md" justifyContent="center" gap="xl">
      <Box gap="sm">
        <Text variant="title">Entrar</Text>
        <Text color="foregroundSecondary">
          Acesse sua conta para continuar.
        </Text>
      </Box>

      <Box flex={1} gap="md">
        <SignInForm />

        <Text color="foregroundSecondary" alignSelf="center">
          Não tem uma conta?{' '}
          <Link href="/(auth)/sign-up">
            <Text textDecorationLine="underline">Criar conta</Text>
          </Link>
        </Text>
      </Box>
    </Box>
  )
}
