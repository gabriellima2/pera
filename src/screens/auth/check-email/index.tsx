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

  const destination = email ? `para ${email}` : 'para o seu e-mail'

  return (
    <Screen>
      <ScreenHeading>
        <ScreenTitle>Verifique sua caixa de entrada</ScreenTitle>
        <ScreenDescription>
          {`Enviamos um link de confirmação ${destination}. Abra o e-mail e toque no link antes de entrar. Não encontrou? Confira a pasta de spam do seu e-mail, ou aguarde alguns minutos.`}
        </ScreenDescription>
      </ScreenHeading>

      <ScreenActions>
        <Button
          label="Voltar para entrar"
          onPress={() => router.replace('/(auth)/sign-in')}
        />
      </ScreenActions>
    </Screen>
  )
}
