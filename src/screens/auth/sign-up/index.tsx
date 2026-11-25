import { BackButton } from '@/components/buttons/back-button'
import { TextLink } from '@/components/links/text-link'
import {
  Screen,
  ScreenBody,
  ScreenHeader,
  ScreenSupplement,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { SignUpForm } from './sign-up-form'

export function SignUpScreen() {
  return (
    <Screen>
      <ScreenHeader>
        <BackButton fallbackHref="/(auth)/sign-in" />
        <ScreenTitle>Criar conta</ScreenTitle>
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
