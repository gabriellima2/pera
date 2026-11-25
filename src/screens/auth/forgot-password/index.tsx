import { BackButton } from '@/components/buttons/back-button'
import {
  Screen,
  ScreenBody,
  ScreenDescription,
  ScreenHeader,
  ScreenHeading,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { ForgotPasswordForm } from './forgot-password-form'

export function ForgotPasswordScreen() {
  return (
    <Screen>
      <ScreenHeader>
        <BackButton fallbackHref="/(auth)/sign-in" />
        <ScreenHeading>
          <ScreenTitle>Recuperar senha</ScreenTitle>
          <ScreenDescription>
            Informe seu e-mail para receber o link de redefinição.
          </ScreenDescription>
        </ScreenHeading>
      </ScreenHeader>

      <ScreenBody>
        <ForgotPasswordForm />
      </ScreenBody>
    </Screen>
  )
}
