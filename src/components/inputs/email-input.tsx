import type { ComponentProps } from 'react'
import { Input } from '../ui/input'

type EmailInputProps = Omit<
  ComponentProps<typeof Input>,
  'autoCapitalize' | 'keyboardType' | 'autoComplete'
>

export function EmailInput(props: EmailInputProps) {
  return (
    <Input
      autoCapitalize="none"
      keyboardType="email-address"
      autoComplete="email"
      placeholder="email@exemplo.com"
      {...props}
    />
  )
}
