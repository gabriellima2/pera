import type { Theme } from '@/theme'
import {
  VariantProps,
  createRestyleComponent,
  createVariant,
} from '@shopify/restyle'
import React from 'react'
import { Box } from './box'

const cardVariant = createVariant<Theme, 'cardVariants'>({
  themeKey: 'cardVariants',
})

export const Card = createRestyleComponent<
  VariantProps<Theme, 'cardVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([cardVariant], Box)
