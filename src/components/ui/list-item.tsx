import type { Theme } from '@/theme'
import {
  VariantProps,
  createRestyleComponent,
  createVariant,
} from '@shopify/restyle'
import React from 'react'
import { Pressable } from 'react-native'
import { Box } from './box'

const listItemVariant = createVariant<Theme, 'listItemVariants'>({
  themeKey: 'listItemVariants',
})

const BaseListItem = createRestyleComponent<
  VariantProps<Theme, 'listItemVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([listItemVariant], Box)

type ListItemProps = React.ComponentProps<typeof BaseListItem> & {
  variant?: 'default' | 'pressable' | 'danger'
  onPress?: () => void
}

export function ListItem({
  variant = 'default',
  children,
  onPress,
  ...props
}: ListItemProps) {
  if (variant === 'pressable' && onPress) {
    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <BaseListItem
            variant={variant}
            opacity={pressed ? 0.7 : 1}
            {...props}
          >
            {children}
          </BaseListItem>
        )}
      </Pressable>
    )
  }

  return (
    <BaseListItem variant={variant} {...props}>
      {children}
    </BaseListItem>
  )
}
