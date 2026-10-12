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
    onSuccess: (_, { email }) => {
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
                  placeholder="Ex.: João da Silva"
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
                  placeholder="Mínimo 6 caracteres"
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
  name: z
    .string()
    .trim()
    .nonempty('Obrigatório')
    .max(255, 'Máximo de 255 caracteres'),
  email: z
    .string()
    .trim()
    .nonempty('Obrigatório')
    .check(z.email('E-mail inválido')),
  password: z
    .string()
    .trim()
    .nonempty('Obrigatório')
    .min(6, 'Mínimo de 6 caracteres'),
})
