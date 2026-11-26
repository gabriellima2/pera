import type { EmotionType } from '@/@types/emotions'
import { Box, type BoxProps } from '@/components/ui/box'
import { Text, type TextProps } from '@/components/ui/text'
import {
  EMOTION_COLORS,
  EMOTION_ICONS,
  EMOTION_LABELS,
} from '@/constants/emotions'
import { createContext, useContext } from 'react'

type EmotionItemContextValue = {
  emotion: EmotionType
}

const EmotionItemContext = createContext<EmotionItemContextValue | null>(null)

function useEmotionItem() {
  const context = useContext(EmotionItemContext)
  if (!context) {
    throw new Error('EmotionItem components must be used within EmotionItem')
  }
  return context
}

export function EmotionItem({
  emotion,
  children,
  ...props
}: BoxProps & {
  emotion: EmotionType
}) {
  return (
    <EmotionItemContext.Provider value={{ emotion }}>
      <Box alignItems="center" gap="sm" {...props}>
        {children}
      </Box>
    </EmotionItemContext.Provider>
  )
}

export function EmotionItemBadge({ children, ...props }: BoxProps) {
  const { emotion } = useEmotionItem()

  return (
    <Box
      width={60}
      height={60}
      borderRadius="full"
      backgroundColor={EMOTION_COLORS[emotion]}
      justifyContent="center"
      alignItems="center"
      gap="xs"
      {...props}
    >
      {children}
    </Box>
  )
}

export function EmotionItemIcon(props: TextProps) {
  const { emotion } = useEmotionItem()

  return (
    <Text fontSize={28} lineHeight={32} {...props}>
      {EMOTION_ICONS[emotion]}
    </Text>
  )
}

export function EmotionItemLabel(props: TextProps) {
  const { emotion } = useEmotionItem()

  return (
    <Text variant="caption" {...props}>
      {EMOTION_LABELS[emotion]}
    </Text>
  )
}
