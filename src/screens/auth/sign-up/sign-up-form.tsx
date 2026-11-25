import { EmailInput } from '@/components/inputs/email-input'
import { PasswordInput } from '@/components/inputs/password-input'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { AUTH_PASSWORD_MIN_LENGTH } from '@/lib/supabase/auth-config'
import { supabaseClient } from '@/lib/supabase/client'
import { isEmailVerified } from '@/lib/supabase/email-verified'
import {
  emailSchema,
  newPasswordSchema,
  userNameSchema,
} from '@/schemas/auth.schema'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { toast } from 'sonner-native'
import { z } from 'zod'

export function SignUpForm() {
  const { signUp } = useAuth()
  const router = useRouter()

  const { mutateAsync: signUpMutation } = useMutation({
    mutationFn: signUp,
    onSuccess: async (_, { email }) => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession()

      if (session && isEmailVerified(session)) {
        router.replace('/(private)/(tabs)/(daily-entries)')
        return
      }

      if (session) {
        router.replace('/verify-email')
        return
      }

      router.replace({
        pathname: '/(auth)/check-email',
        params: { email },
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: ({ value }) =>
      signUpMutation({
        name: value.name,
        email: value.email,
        password: value.password,
      }),
  })

  return (
    <Form>
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  autoComplete="name"
                  placeholder="Ex.: João"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
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
                <PasswordInput
                  id={field.name}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  newPassword
                  placeholder={`Mínimo de ${AUTH_PASSWORD_MIN_LENGTH} caracteres`}
                />
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
            label="Criar conta"
            loading={isSubmitting}
            onPress={form.handleSubmit}
          />
        )}
      />
    </Form>
  )
}

const signUpSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  password: newPasswordSchema,
})
