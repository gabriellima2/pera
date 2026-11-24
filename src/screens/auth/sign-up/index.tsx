import { BackButton } from '@/components/buttons/back-button'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Link } from 'expo-router'
import { Pressable } from 'react-native'
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

        <Box
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          alignSelf="center"
        >
          <Text color="foregroundSecondary">Já tem uma conta? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable>
              {({ pressed }) => (
                <Text
                  textDecorationLine="underline"
                  opacity={pressed ? 0.8 : 1}
                >
                  Entrar
                </Text>
              )}
            </Pressable>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
