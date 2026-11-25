import {
  Screen,
  ScreenBody,
  ScreenDescription,
  ScreenHeading,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { ResetPasswordForm } from './reset-password-form'

export function ResetPasswordScreen() {
  return (
    <Screen>
      <ScreenHeading>
        <ScreenTitle>Nova senha</ScreenTitle>
        <ScreenDescription>
          Defina uma nova senha para sua conta.
        </ScreenDescription>
      </ScreenHeading>

      <ScreenBody>
        <ResetPasswordForm />
      </ScreenBody>
    </Screen>
  )
}
