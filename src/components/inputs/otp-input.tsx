import { AUTH_EMAIL_OTP_LENGTH } from '@/lib/supabase/auth-config'
import type { ComponentProps } from 'react'
import { Input } from '../ui/input'

type OtpInputProps = Omit<
  ComponentProps<typeof Input>,
  'keyboardType' | 'autoComplete' | 'textContentType' | 'maxLength'
>

export function OtpInput(props: OtpInputProps) {
  return (
    <Input
      keyboardType="number-pad"
      autoComplete="one-time-code"
      textContentType="oneTimeCode"
      maxLength={AUTH_EMAIL_OTP_LENGTH}
      {...props}
    />
  )
}
