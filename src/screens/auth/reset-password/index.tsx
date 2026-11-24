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
import { getAuthErrorMessage } from '@/lib/supabase/auth-errors'
import { newPasswordWithConfirmationSchema } from '@/lib/auth/password-schemas'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'expo-router'
import { toast } from 'sonner-native'

export function ResetPasswordScreen() {
  const { updatePassword } = useAuth()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: newPasswordWithConfirmationSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await updatePassword(value.password)
      if (error) {
        toast.error(getAuthErrorMessage(error))
        return
      }
      toast.success('Senha atualizada')
      router.replace('/(private)/(tabs)/(daily-entries)')
    },
  })

  return (
    <Box flex={1} px="md" justifyContent="center" gap="xl">
      <Box gap="sm">
        <Text variant="title">Nova senha</Text>
        <Text color="foregroundSecondary">
          Defina uma nova senha para sua conta.
        </Text>
      </Box>

      <Form gap="lg">
        <FieldGroup>
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Nova senha</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    secureTextEntry
                    autoComplete="new-password"
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
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    secureTextEntry
                    autoComplete="new-password"
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
    </Box>
  )
}
