import type { Theme } from '@/theme'
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle'
import React, { useMemo } from 'react'
import { ActivityIndicator, Pressable } from 'react-native'
import { Box } from './box'
import { Text } from './text'

const buttonVariant = createVariant<Theme, 'buttonVariants'>({
  themeKey: 'buttonVariants',
})

const BaseButton = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([buttonVariant], Box)

const paddingMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

const fontSizeMap = {
  sm: 12,
  md: 14,
  lg: 16,
} as const

type ButtonProps = React.ComponentProps<typeof BaseButton> & {
  label?: string
  loading?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  iconRight?: React.ReactNode
  iconLeft?: React.ReactNode
  onPress?: () => void
}

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  loading = false,
  disabled = false,
  iconRight,
  iconLeft,
  children,
  onPress,
  ...props
}: ButtonProps) {
  const textColor = useMemo(() => {
    switch (variant) {
      case 'primary':
        return 'accentForeground'
      case 'danger':
        return 'accentForeground'
      case 'secondary':
        return 'surfaceForeground'
      case 'ghost':
        return 'foreground'
      default:
        return 'accentForeground'
    }
  }, [variant])

  const loadingIndicatorColor = useMemo(() => {
    switch (variant) {
      case 'secondary':
        return 'black'
      case 'ghost':
        return 'black'
      default:
        return 'white'
    }
  }, [variant])

  return (
    <Pressable onPress={onPress} disabled={loading || disabled}>
      {({ pressed }) => (
        <BaseButton
          variant={variant}
          padding={paddingMap[size]}
          borderRadius="lg"
          alignItems="center"
          justifyContent="center"
          flexDirection="row"
          gap="sm"
          opacity={pressed ? 0.7 : 1}
          {...props}
        >
          {loading ? (
            <ActivityIndicator color={loadingIndicatorColor} />
          ) : children ? (
            children
          ) : (
            <>
              {iconLeft}
              <Text
                color={textColor}
                fontSize={fontSizeMap[size]}
                fontWeight="500"
              >
                {label}
              </Text>
              {iconRight}
            </>
          )}
        </BaseButton>
      )}
    </Pressable>
  )
}
