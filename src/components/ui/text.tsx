import type { Theme } from '@/theme'
import { createText } from '@shopify/restyle'
import type { ComponentProps } from 'react'

export const Text = createText<Theme>()

export type TextProps = ComponentProps<typeof Text>
