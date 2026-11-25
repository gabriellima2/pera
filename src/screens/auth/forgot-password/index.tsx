import { TextLink } from '@/components/links/text-link'
import {
  Screen,
  ScreenBody,
  ScreenDescription,
  ScreenHeading,
  ScreenSupplement,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { ForgotPasswordForm } from './forgot-password-form'

export function ForgotPasswordScreen() {
  return (
    <Screen>
      <ScreenHeading>
        <ScreenTitle>Recuperar senha</ScreenTitle>
        <ScreenDescription>
          Informe seu e-mail para receber o link de redefinição.
        </ScreenDescription>
      </ScreenHeading>

      <ScreenBody>
        <ForgotPasswordForm />

        <ScreenSupplement>
          <TextLink href="/(auth)/sign-in">Voltar ao login</TextLink>
        </ScreenSupplement>
      </ScreenBody>
    </Screen>
  )
}
