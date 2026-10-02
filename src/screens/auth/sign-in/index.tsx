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

const signInSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Obrigatório'),
})

export function SignInScreen() {
  const { signInWithEmail } = useAuth()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await signInWithEmail(value.email, value.password)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Login realizado')
    },
  })

  return (
    <Box flex={1} px="md" justifyContent="center" gap="xl">
      <Box gap="sm">
        <Text variant="title">Entrar</Text>
        <Text color="foregroundSecondary">
          Acesse sua conta para continuar.
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
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    secureTextEntry
                    autoComplete="password"
                    placeholder="Sua senha"
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
              label="Entrar"
              loading={isSubmitting}
              onPress={form.handleSubmit}
            />
          )}
        />
      </Form>

      <Box gap="md" alignItems="center">
        <Link href="/(auth)/forgot-password">
          <Text color="foregroundSecondary">Esqueci minha senha</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text color="foregroundSecondary">Criar conta</Text>
        </Link>
      </Box>
    </Box>
  )
}
