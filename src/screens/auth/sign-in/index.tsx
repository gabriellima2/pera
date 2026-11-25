import { TextLink } from '@/components/links/text-link'
import {
  Screen,
  ScreenBody,
  ScreenSupplement,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { SignInForm } from './sign-in-form'

export function SignInScreen() {
  return (
    <Screen>
      <ScreenTitle>Entrar</ScreenTitle>

      <ScreenBody>
        <SignInForm />

        <ScreenSupplement>
          <TextLink
            href="/(auth)/sign-up"
            prompt="Não tem uma conta?"
            underline
          >
            Criar conta
          </TextLink>
        </ScreenSupplement>
      </ScreenBody>
    </Screen>
  )
}
