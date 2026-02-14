import React from 'react'
import { ActivityIndicator, Pressable } from 'react-native'
import { Box } from './box'
import { Text } from './text'

type ButtonProps = React.PropsWithChildren<{
  label?: string
  loading?: boolean
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md'
  iconRight?: React.ReactNode
  iconLeft?: React.ReactNode
  onPress?: () => void
}>

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  loading = false,
  iconRight,
  iconLeft,
  children,
  onPress,
}: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={loading}>
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
        ) : children ? (
          children
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
    </Pressable>
  )
}
