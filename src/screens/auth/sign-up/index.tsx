import { BackButton } from '@/components/buttons/back-button'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Link } from 'expo-router'
import { SignUpForm } from './sign-up-form'

export function SignUpScreen() {
  return (
    <Box flex={1} px="md" justifyContent="center" gap="xl">
      <Box gap="md" flexDirection="row" alignItems="center">
        <BackButton fallbackHref="/(auth)/sign-in" />
        <Box gap="sm">
          <Text variant="title">Criar conta</Text>
          <Text color="foregroundSecondary">
            Preencha seus dados para criar uma conta.
          </Text>
        </Box>
      </Box>

      <Box flex={1} gap="md">
        <SignUpForm />

        <Text color="foregroundSecondary" alignSelf="center">
          Já tem uma conta?{' '}
          <Link href="/(auth)/sign-in">
            <Text textDecorationLine="underline">Entrar</Text>
          </Link>
        </Text>
      </Box>
    </Box>
  )
}
