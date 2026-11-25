import {
  Screen,
  ScreenActions,
  ScreenDescription,
  ScreenHeading,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { Button } from '@/components/ui/button'
import { useLocalSearchParams, useRouter } from 'expo-router'

export function CheckEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>()
  const router = useRouter()

  return (
    <Screen>
      <ScreenHeading>
        <ScreenTitle>Confirme seu e-mail</ScreenTitle>
        <ScreenDescription>
          Enviamos um link de confirmação
          {email ? ` para ${email}` : ''}. Abra o e-mail e confirme sua conta
          antes de entrar.
        </ScreenDescription>
      </ScreenHeading>

      <ScreenActions>
        <Button
          label="Ir para entrar"
          onPress={() => router.replace('/(auth)/sign-in')}
        />
      </ScreenActions>
    </Screen>
  )
}
