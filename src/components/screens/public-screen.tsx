import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import type { ComponentProps } from 'react'

type ScreenProps = ComponentProps<typeof Box>
type ScreenTextProps = ComponentProps<typeof Text>

export function Screen({ children, ...props }: ScreenProps) {
  return (
    <Box flex={1} px="md" justifyContent="center" gap="xl" {...props}>
      {children}
    </Box>
  )
}

export function ScreenHeader({ children, ...props }: ScreenProps) {
  return (
    <Box
      gap="md"
      flexDirection="row"
      alignItems="center"
      alignSelf="stretch"
      minWidth={0}
      {...props}
    >
      {children}
    </Box>
  )
}

export function ScreenHeading({ children, ...props }: ScreenProps) {
  return (
    <Box gap="sm" flexShrink={1} minWidth={0} alignSelf="stretch" {...props}>
      {children}
    </Box>
  )
}

export function ScreenTitle({ children, ...props }: ScreenTextProps) {
  return (
    <Text variant="title" flexShrink={1} {...props}>
      {children}
    </Text>
  )
}

export function ScreenDescription({ children, ...props }: ScreenTextProps) {
  return (
    <Text color="foregroundSecondary" flexShrink={1} {...props}>
      {children}
    </Text>
  )
}

export function ScreenBody({ children, ...props }: ScreenProps) {
  return (
    <Box flex={1} gap="md" {...props}>
      {children}
    </Box>
  )
}

export function ScreenActions({ children, ...props }: ScreenProps) {
  return (
    <Box gap="md" {...props}>
      {children}
    </Box>
  )
}

export function ScreenSupplement({ children, ...props }: ScreenProps) {
  return (
    <Box
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="center"
      alignSelf="center"
      alignItems="center"
      {...props}
    >
      {children}
    </Box>
  )
}
