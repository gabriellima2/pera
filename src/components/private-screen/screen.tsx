import { Box, type BoxProps } from '@/components/ui/box'
import { Text, type TextProps } from '@/components/ui/text'
import { PADDING_BOTTOM_TAB_BAR_HEIGHT } from '@/constants/styles'
import { theme } from '@/theme'
import { useCallback, type ComponentProps } from 'react'
import {
  FlatList,
  type FlatListProps,
  type ListRenderItemInfo,
} from 'react-native'

export function Screen({
  bottomTabSpacing = false,
  style,
  ...props
}: BoxProps & { bottomTabSpacing?: boolean }) {
  return (
    <Box
      flex={1}
      px="md"
      pt="sm"
      gap="lg"
      backgroundColor="background"
      style={[
        {
          paddingBottom: bottomTabSpacing
            ? PADDING_BOTTOM_TAB_BAR_HEIGHT
            : undefined,
        },
        style,
      ]}
      {...props}
    />
  )
}

export function ScreenSurface({ style, ...props }: ComponentProps<typeof Box>) {
  return <Box backgroundColor="surface" py="lg" px="md" gap="lg" {...props} />
}

export function ScreenHeader(props: BoxProps) {
  return (
    <Box
      gap="md"
      flexDirection="row"
      alignItems="center"
      alignSelf="stretch"
      minWidth={0}
      pb="lg"
      {...props}
    />
  )
}

export function ScreenTitle(props: TextProps) {
  return <Text variant="title" flexShrink={1} {...props} />
}

export function ScreenList(props: BoxProps) {
  return <Box gap="sm" {...props} />
}

export function ScreenFlatList<T>({
  contentContainerStyle,
  renderItem,
  ...props
}: FlatListProps<T>) {
  const wrapperRenderItem = useCallback(
    (info: ListRenderItemInfo<T>) => <Box mb="sm">{renderItem?.(info)}</Box>,
    [renderItem],
  )

  return (
    <FlatList
      contentContainerStyle={[
        {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        },
        contentContainerStyle,
      ]}
      renderItem={wrapperRenderItem}
      {...props}
    />
  )
}
