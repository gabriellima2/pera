import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import { Box } from './box'
import { Text } from './text'

type Props = {
  label: string
  loading?: boolean
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md'
  iconRight?: React.ReactNode
  iconLeft?: React.ReactNode
  onPress: () => void
}

const Button = ({
  variant = 'primary',
  size = 'md',
  label,
  loading = false,
  iconRight,
  iconLeft,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
      <Box
        backgroundColor={variant === 'primary' ? 'accent' : 'surfaceAlt'}
        padding={size === 'sm' ? 'sm' : 'md'}
        borderRadius="full"
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
        gap="sm"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            {iconLeft}
            <Text
              color={
                variant === 'primary' ? 'accentForeground' : 'surfaceForeground'
              }
              fontWeight="400"
            >
              {label}
            </Text>
            {iconRight}
          </>
        )}
      </Box>
    </TouchableOpacity>
  )
}

export default Button
