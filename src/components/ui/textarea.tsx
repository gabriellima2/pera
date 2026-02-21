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

export function Textarea({
  id,
  style,
  numberOfLines = 4,
  ...props
}: Omit<React.ComponentProps<typeof BaseTextInput>, 'aria-labelledby'> & {
  id?: string
}) {
  return (
    <BaseTextInput
      variant="default"
      aria-labelledby={id}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      keyboardAppearance="light"
      placeholderTextColor={theme.colors.foregroundSecondary}
      style={[style, { minHeight: 100 }]}
      {...props}
    />
  )
}
