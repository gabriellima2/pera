import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Link } from 'expo-router'
import { Pressable } from 'react-native'
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

        <Box
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          alignSelf="center"
        >
          <Text color="foregroundSecondary">Não tem uma conta? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable>
              {({ pressed }) => (
                <Text
                  textDecorationLine="underline"
                  opacity={pressed ? 0.8 : 1}
                >
                  Criar conta
                </Text>
              )}
            </Pressable>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
