import {
  AUTH_EMAIL_OTP_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
  AUTH_USER_NAME_MAX_LENGTH,
} from '@/lib/supabase/auth-config'
import { z } from 'zod'

export const currentPasswordSchema = z.string().trim().nonempty('Obrigatório')

export const newPasswordSchema = z
  .string()
  .trim()
  .nonempty('Obrigatório')
  .min(
    AUTH_PASSWORD_MIN_LENGTH,
    `Mínimo de ${AUTH_PASSWORD_MIN_LENGTH} caracteres`,
  )

export const newPasswordWithConfirmationSchema = z
  .object({
    password: newPasswordSchema,
    confirmPassword: z.string().trim().nonempty('Obrigatório'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const emailSchema = z
  .string()
  .trim()
  .nonempty('Obrigatório')
  .check(z.email('E-mail inválido'))

export const userNameSchema = z
  .string()
  .trim()
  .nonempty('Obrigatório')
  .max(
    AUTH_USER_NAME_MAX_LENGTH,
    `Máximo de ${AUTH_USER_NAME_MAX_LENGTH} caracteres`,
  )

export const emailOtpCodeSchema = z
  .string()
  .trim()
  .nonempty(`Obrigatório`)
  .regex(/^\d+$/, `Deve conter apenas números`)
  .length(AUTH_EMAIL_OTP_LENGTH, `Deve conter ${AUTH_EMAIL_OTP_LENGTH} dígitos`)
