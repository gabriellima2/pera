import { Box, type BoxProps } from '../ui/box'
import { Text, type TextProps } from '../ui/text'

export function Section(props: BoxProps) {
  return <Box gap="md" {...props} />
}

export function SectionHeader(props: BoxProps) {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      {...props}
    />
  )
}

export function SectionTitle(props: TextProps) {
  return <Text variant="subtitle" {...props} />
}
