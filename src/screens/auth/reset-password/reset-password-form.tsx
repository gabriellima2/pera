import { PasswordInput } from '@/components/inputs/password-input'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { useAuth } from '@/contexts/auth-context'
import { newPasswordWithConfirmationSchema } from '@/schemas/auth.schema'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { toast } from 'sonner-native'

export function ResetPasswordForm() {
  const { updatePassword } = useAuth()
  const router = useRouter()

  const { mutateAsync: updatePasswordMutation } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Senha atualizada')
      router.replace('/(private)/(tabs)/(daily-entries)')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: newPasswordWithConfirmationSchema,
    },
    onSubmit: ({ value }) => updatePasswordMutation(value.password),
  })

  return (
    <Form>
      <FieldGroup>
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Nova senha</FieldLabel>
                <PasswordInput
                  id={field.name}
                  newPassword
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
          name="confirmPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Confirmar senha</FieldLabel>
                <PasswordInput
                  id={field.name}
                  newPassword
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
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
            label="Salvar senha"
            loading={isSubmitting}
            onPress={form.handleSubmit}
          />
        )}
      />
    </Form>
  )
}
