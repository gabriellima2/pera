import type { Theme } from '@/theme'
import {
  createRestyleComponent,
  createVariant,
  type VariantProps,
} from '@shopify/restyle'
import { Pressable } from 'react-native'
import { Box } from './box'
import { Text } from './text'

function ChipGroup(props: React.ComponentProps<typeof Box>) {
  return <Box flexDirection="row" gap="sm" flexWrap="wrap" {...props} />
}

const chipVariant = createVariant<Theme, 'chipVariants'>({
  themeKey: 'chipVariants',
})

const BaseChip = createRestyleComponent<
  VariantProps<Theme, 'chipVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([chipVariant], Box)

type ChipProps = React.ComponentProps<typeof BaseChip> & {
  label: string
  rightIcon?: React.ElementType
  leftIcon?: React.ElementType
  onPress: () => void
}

function Chip({
  label,
  rightIcon: RightIcon,
  leftIcon: LeftIcon,
  onPress,
  ...props
}: ChipProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <BaseChip
          flexDirection="row"
          alignItems="center"
          gap="sm"
          borderRadius="lg"
          py="xs"
          px="regular"
          opacity={pressed ? 0.8 : 1}
          {...props}
        >
          {LeftIcon && <LeftIcon size={16} />}
          <Text>{label}</Text>
          {RightIcon && <RightIcon size={16} />}
        </BaseChip>
      )}
    </Pressable>
  )
}

export { Chip, ChipGroup }
