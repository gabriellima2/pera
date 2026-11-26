import { EmotionType } from '@/@types/emotions'
import { EMOTION_TYPE_ENUM } from '@/constants/enums'
import { theme } from '@/theme'
import { ComponentProps, Fragment, ReactNode } from 'react'
import { ScrollView } from 'react-native'

type EmotionHorizontalListProps = Omit<
  ComponentProps<typeof ScrollView>,
  'children'
> & {
  renderItem: (emotion: EmotionType) => ReactNode
}

export function EmotionHorizontalList({
  contentContainerStyle,
  renderItem,
  ...props
}: EmotionHorizontalListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -theme.spacing.md }}
      contentContainerStyle={[
        {
          gap: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
        },
        contentContainerStyle,
      ]}
      {...props}
    >
      {Object.values(EMOTION_TYPE_ENUM).map((emotion) => (
        <Fragment key={emotion}>{renderItem(emotion)}</Fragment>
      ))}
    </ScrollView>
  )
}
