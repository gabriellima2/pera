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
import { Link, useRouter } from 'expo-router'
import { toast } from 'sonner-native'
import { z } from 'zod'

const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Obrigatório'),
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
})

export function SignUpScreen() {
  const { signUpWithEmail } = useAuth()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await signUpWithEmail(value)
      if (error) {
        toast.error(error.message)
        return
      }
      router.replace({
        pathname: '/(auth)/check-email',
        params: { email: value.email },
      })
    },
  })

  return (
    <Box flex={1} px="md" justifyContent="center" gap="xl">
      <Box gap="sm">
        <Text variant="title">Criar conta</Text>
        <Text color="foregroundSecondary">
          Preencha seus dados para se cadastrar.
        </Text>
      </Box>

      <Form gap="lg">
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
                    placeholder="Seu nome"
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
                    autoComplete="new-password"
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
              label="Cadastrar"
              loading={isSubmitting}
              onPress={form.handleSubmit}
            />
          )}
        />
      </Form>

      <Box alignItems="center">
        <Link href="/(auth)/sign-in">
          <Text color="foregroundSecondary">Já tenho conta</Text>
        </Link>
      </Box>
    </Box>
  )
}
