import { BackButton } from '@/components/buttons/back-button'
import { TextLink } from '@/components/links/text-link'
import {
  Screen,
  ScreenBody,
  ScreenDescription,
  ScreenHeader,
  ScreenHeading,
  ScreenSupplement,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { SignUpForm } from './sign-up-form'

export function SignUpScreen() {
  return (
    <Screen>
      <ScreenHeader>
        <BackButton fallbackHref="/(auth)/sign-in" />
        <ScreenHeading>
          <ScreenTitle>Criar conta</ScreenTitle>
          <ScreenDescription>
            Preencha seus dados para criar uma conta.
          </ScreenDescription>
        </ScreenHeading>
      </ScreenHeader>

      <ScreenBody>
        <SignUpForm />

        <ScreenSupplement>
          <TextLink href="/(auth)/sign-in" prompt="Já tem uma conta?" underline>
            Entrar
          </TextLink>
        </ScreenSupplement>
      </ScreenBody>
    </Screen>
  )
}
