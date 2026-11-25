import { EmailInput } from '@/components/inputs/email-input'
import { PasswordInput } from '@/components/inputs/password-input'
import { TextLink } from '@/components/links/text-link'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { useAuth } from '@/contexts/auth-context'
import { currentPasswordSchema, emailSchema } from '@/schemas/auth.schema'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { toast } from 'sonner-native'
import { z } from 'zod'

export function SignInForm() {
  const { signIn } = useAuth()
  const router = useRouter()

  const { mutateAsync: signInMutation } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      router.replace('/(private)/(tabs)/(daily-entries)')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: ({ value }) =>
      signInMutation({ email: value.email, password: value.password }),
  })

  return (
    <Form>
      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
                <EmailInput
                  id={field.name}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                <Box gap="sm">
                  <PasswordInput
                    id={field.name}
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                  <Box alignSelf="flex-end">
                    <TextLink href="/(auth)/forgot-password">
                      Esqueceu sua senha?
                    </TextLink>
                  </Box>
                </Box>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <Button
            label="Entrar"
            loading={isSubmitting}
            onPress={form.handleSubmit}
          />
        )}
      />
    </Form>
  )
}

const signInSchema = z.object({
  email: emailSchema,
  password: currentPasswordSchema,
})
