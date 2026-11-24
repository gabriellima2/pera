import { BackButton } from '@/components/buttons/back-button'
import { OtpInput } from '@/components/inputs/otp-input'
import { PasswordInput } from '@/components/inputs/password-input'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/contexts/auth-context'
import { ReauthenticationRequiredError } from '@/errors/reauthenticated-required-error'
import {
  changePasswordSchema,
  reauthenticationNonceValueSchema,
} from '@/lib/auth/password-schemas'
import { isReauthenticationNeeded } from '@/lib/supabase/auth-errors'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { toast } from 'sonner-native'

type ChangePasswordFormValues = {
  currentPassword: string
  password: string
  confirmPassword: string
  nonce: string
}

type ChangePasswordMutationInput = ChangePasswordFormValues & {
  needsReauthentication: boolean
}

export function ChangePasswordScreen() {
  const { changePassword, requestReauthentication } = useAuth()
  const router = useRouter()
  const [needsReauthentication, setNeedsReauthentication] = useState(false)

  const { mutateAsync: changePasswordMutation } = useMutation({
    mutationFn: async ({
      currentPassword,
      password,
      nonce,
      needsReauthentication: requiresNonce,
    }: ChangePasswordMutationInput) => {
      if (requiresNonce) {
        const nonceResult = reauthenticationNonceValueSchema.safeParse(nonce)
        if (!nonceResult.success) {
          throw new Error(
            nonceResult.error.issues[0]?.message ??
              'Código de confirmação inválido',
          )
        }
      }

      try {
        await changePassword({
          currentPassword,
          newPassword: password,
          ...(requiresNonce ? { nonce: nonce.trim() } : {}),
        })
      } catch (error) {
        if (!requiresNonce && isReauthenticationNeeded(error)) {
          await requestReauthentication()
          throw new ReauthenticationRequiredError()
        }

        throw error
      }
    },
    onSuccess: () => {
      toast.success('Senha atualizada')
      router.back()
    },
    onError: (error) => {
      if (error instanceof ReauthenticationRequiredError) {
        setNeedsReauthentication(true)
        toast.success('Enviamos um código de confirmação para seu e-mail')
        return
      }
      toast.error(error.message)
    },
  })

  const { mutateAsync: resendReauthCode, isPending: isResendingCode } =
    useMutation({
      mutationFn: requestReauthentication,
      onSuccess: () => {
        toast.success('Código de confirmação reenviado para seu e-mail')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
      nonce: '',
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: ({ value }) =>
      changePasswordMutation({
        ...value,
        needsReauthentication,
      }),
  })

  return (
    <Box flex={1}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box px="md" flex={1} mt="lg" gap="lg">
          <Box gap="md" flexDirection="row" alignItems="center" height={42}>
            <BackButton />
            <Text variant="title">Alterar senha</Text>
          </Box>

          <Form>
            <FieldGroup>
              <form.Field
                name="currentPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Senha atual</FieldLabel>
                      <PasswordInput
                        id={field.name}
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
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
                      <FieldLabel htmlFor={field.name}>Nova senha</FieldLabel>
                      <PasswordInput
                        id={field.name}
                        newPassword
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
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
                      <FieldLabel htmlFor={field.name}>
                        Confirmar nova senha
                      </FieldLabel>
                      <PasswordInput
                        id={field.name}
                        newPassword
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              {needsReauthentication && (
                <form.Field
                  name="nonce"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Código de confirmação
                      </FieldLabel>
                      <OtpInput
                        id={field.name}
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )}
                />
              )}
            </FieldGroup>
          </Form>

          <Box gap="md">
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
            {needsReauthentication && (
              <Button
                label="Reenviar código de confirmação"
                variant="secondary"
                loading={isResendingCode}
                onPress={() => void resendReauthCode()}
              />
            )}
          </Box>
        </Box>
      </ScrollView>
    </Box>
  )
}
