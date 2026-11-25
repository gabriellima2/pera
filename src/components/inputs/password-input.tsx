import { Box } from '@/components/ui/box'
import { PressableFeedback } from '@/components/ui/pressable-feedback'
import { theme } from '@/theme'
import { Eye, EyeOff } from 'lucide-react-native'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { Input } from '../ui/input'

type PasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  'autoCapitalize' | 'secureTextEntry' | 'autoComplete'
> & {
  newPassword?: boolean
}

const ICON_SIZE = 20
const TOGGLE_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 }

export function PasswordInput({
  newPassword = false,
  style,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <Box>
      <Input
        autoCapitalize="none"
        secureTextEntry={!visible}
        autoComplete={newPassword ? 'new-password' : 'password'}
        textContentType={newPassword ? 'newPassword' : 'password'}
        style={[
          { paddingRight: theme.spacing.md + ICON_SIZE + theme.spacing.sm },
          style,
        ]}
        {...props}
      />
      <Box
        position="absolute"
        right={theme.spacing.regular}
        top={0}
        bottom={0}
        justifyContent="center"
      >
        <PressableFeedback
          onPress={() => setVisible((current) => !current)}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          hitSlop={TOGGLE_HIT_SLOP}
        >
          {visible ? (
            <EyeOff size={ICON_SIZE} color={theme.colors.foregroundSecondary} />
          ) : (
            <Eye size={ICON_SIZE} color={theme.colors.foregroundSecondary} />
          )}
        </PressableFeedback>
      </Box>
    </Box>
  )
}
