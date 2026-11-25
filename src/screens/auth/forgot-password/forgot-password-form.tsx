import { EmailInput } from '@/components/inputs/email-input'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { useAuth } from '@/contexts/auth-context'
import { emailSchema } from '@/schemas/auth.schema'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { z } from 'zod'

export function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth()

  const { mutateAsync: requestPasswordResetMutation } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      toast.success('Enviamos instruções para redefinir sua senha')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm({
    defaultValues: { email: '' },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => requestPasswordResetMutation(value.email),
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
                  placeholder="seu@email.com"
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
            label="Enviar link"
            loading={isSubmitting}
            onPress={form.handleSubmit}
          />
        )}
      />
    </Form>
  )
}

const forgotPasswordSchema = z.object({
  email: emailSchema,
})
