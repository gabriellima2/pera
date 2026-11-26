import type { Theme } from '@/theme'
import { createBox } from '@shopify/restyle'
import type { ComponentProps } from 'react'

export const Box = createBox<Theme>()

export type BoxProps = ComponentProps<typeof Box>
