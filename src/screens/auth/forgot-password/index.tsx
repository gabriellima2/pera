import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/contexts/auth-context'
import { useForm } from '@tanstack/react-form'
import { Link } from 'expo-router'
import { toast } from 'sonner-native'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.email('E-mail inválido'),
})

export function ForgotPasswordScreen() {
  const { requestPasswordReset } = useAuth()

  const form = useForm({
    defaultValues: { email: '' },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await requestPasswordReset(value.email)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Enviamos instruções para redefinir sua senha')
    },
  })

  return (
    <Box flex={1} px="md" justifyContent="center" gap="xl">
      <Box gap="sm">
        <Text variant="title">Recuperar senha</Text>
        <Text color="foregroundSecondary">
          Informe seu e-mail para receber o link de redefinição.
        </Text>
      </Box>

      <Form gap="lg">
        <FieldGroup>
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
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

      <Box alignItems="center">
        <Link href="/(auth)/sign-in">
          <Text color="foregroundSecondary">Voltar ao login</Text>
        </Link>
      </Box>
    </Box>
  )
}
