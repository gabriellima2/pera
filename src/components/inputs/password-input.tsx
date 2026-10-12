import type { ComponentProps } from 'react'
import { Input } from '../ui/input'

type PasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  'autoCapitalize' | 'secureTextEntry' | 'autoComplete'
> & {
  newPassword?: boolean
}

export function PasswordInput({
  newPassword = false,
  ...props
}: PasswordInputProps) {
  return (
    <Input
      autoCapitalize="none"
      secureTextEntry
      autoComplete={newPassword ? 'new-password' : 'password'}
      textContentType={newPassword ? 'newPassword' : 'password'}
      {...props}
    />
  )
}
