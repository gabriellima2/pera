import { TextLink } from '@/components/links/text-link'
import {
  Screen,
  ScreenBody,
  ScreenDescription,
  ScreenHeading,
  ScreenSupplement,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { SignInForm } from './sign-in-form'

export function SignInScreen() {
  return (
    <Screen>
      <ScreenHeading>
        <ScreenTitle>Entrar</ScreenTitle>
        <ScreenDescription>Acesse sua conta para continuar.</ScreenDescription>
      </ScreenHeading>

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
