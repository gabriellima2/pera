import { TextLink } from '@/components/links/text-link'
import {
  Screen,
  ScreenBody,
  ScreenDescription,
  ScreenHeading,
  ScreenSupplement,
  ScreenTitle,
} from '@/components/screens/public-screen'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useMutation } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { toast } from 'sonner-native'
import { z } from 'zod'

export function CheckEmailScreen() {
  const params = useLocalSearchParams()
  const parsed = checkEmailSearchParamsSchema.safeParse(params)
  const email = parsed.success ? parsed.data.email : undefined

  const { resendSignupConfirmation } = useAuth()

  const { mutateAsync: resendConfirmation, isPending: isResending } =
    useMutation({
      mutationFn: () => resendSignupConfirmation(email),
      onSuccess: () => {
        toast.success('E-mail de confirmação reenviado')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const destination = email ? `para ${email}` : 'para o seu e-mail'

  return (
    <Screen>
      <ScreenBody>
        <ScreenHeading flex={1} justifyContent="center" alignItems="center">
          <ScreenTitle textAlign="center">Confirme seu e-mail</ScreenTitle>
          <ScreenDescription textAlign="center">
            {`Enviamos um link de confirmação ${destination}. Toque no link para abrir o Pera e sua conta será ativada automaticamente. Não achou o e-mail? Confira o spam ou aguarde alguns minutos.`}
          </ScreenDescription>
        </ScreenHeading>

        <Button
          label="Reenviar e-mail"
          variant="secondary"
          loading={isResending}
          onPress={() => void resendConfirmation()}
        />

        <ScreenSupplement>
          <TextLink
            href="/(auth)/sign-in"
            prompt="Já confirmou em outro aparelho?"
            underline
          >
            Entrar
          </TextLink>
        </ScreenSupplement>
      </ScreenBody>
    </Screen>
  )
}

const checkEmailSearchParamsSchema = z.object({
  email: z.preprocess(
    (value) => (Array.isArray(value) ? value[0] : value),
    z.string().trim().min(1).check(z.email()),
  ),
})
