import { Theme, theme } from '@/theme'
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle'
import { TextInput } from 'react-native'

const inputVariant = createVariant<Theme, 'inputVariants'>({
  themeKey: 'inputVariants',
})

const BaseTextInput = createRestyleComponent<
  VariantProps<Theme, 'inputVariants'> & React.ComponentProps<typeof TextInput>,
  Theme
>([inputVariant], TextInput)

export function Input({
  id,
  ...props
}: Omit<React.ComponentProps<typeof BaseTextInput>, 'aria-labelledby'> & {
  id?: string
}) {
  return (
    <BaseTextInput
      aria-labelledby={id}
      keyboardAppearance="light"
      placeholderTextColor={theme.colors.foregroundSecondary}
      {...props}
    />
  )
}
