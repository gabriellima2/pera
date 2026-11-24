import { AUTH_EMAIL_OTP_LENGTH } from '@/lib/supabase/auth-config'
import { z } from 'zod'

export const newPasswordWithConfirmationSchema = z
  .object({
    password: z
      .string()
      .nonempty('Obrigatório')
      .min(6, 'Mínimo de 6 caracteres'),
    confirmPassword: z.string().nonempty('Obrigatório'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const changePasswordSchema = newPasswordWithConfirmationSchema.extend({
  currentPassword: z.string().nonempty('Obrigatório'),
  nonce: z.string(),
})

export const reauthenticationNonceValueSchema = z
  .string()
  .trim()
  .nonempty('O código de confirmação é obrigatório')
  .regex(/^\d+$/, 'O código de confirmação deve conter apenas números')
  .length(
    AUTH_EMAIL_OTP_LENGTH,
    `O código de confirmação deve ter ${AUTH_EMAIL_OTP_LENGTH} dígitos`,
  )
