import type { EmotionType } from '@/@types/emotions'
import { EmotionHorizontalList } from '@/components/emotions/emotion-horizontal-list'
import {
  EmotionItem,
  EmotionItemBadge,
  EmotionItemIcon,
  EmotionItemLabel,
} from '@/components/emotions/emotion-item'
import {
  EmotionItemSkeleton,
  EmotionItemSkeletonBadge,
  EmotionItemSkeletonLabel,
} from '@/components/emotions/emotion-item-skeleton'
import { ScreenSurface } from '@/components/private-screen/screen'
import { StateText } from '@/components/texts/state-text'
import { PressableFeedback } from '@/components/ui/pressable-feedback'
import { TextSkeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { todayDailyEntryQueryOptions } from '@/lib/react-query/queries/daily-entries'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

export function TodayDailyEntry() {
  const router = useRouter()

  const {
    data: todayDailyEntry,
    error: todayDailyEntryError,
    isPending: isLoadingTodayDailyEntry,
  } = useQuery(todayDailyEntryQueryOptions())

  const handleSelectEmotion = (emotion: EmotionType) => {
    router.push({
      pathname: '/create-daily-entry',
      params: { emotion },
    })
  }

  if (isLoadingTodayDailyEntry) {
    return (
      <ScreenSurface>
        <TextSkeleton
          variant="title"
          width={200}
          backgroundColor="background"
        />
        <EmotionHorizontalList
          renderItem={() => (
            <EmotionItemSkeleton>
              <EmotionItemSkeletonBadge />
              <EmotionItemSkeletonLabel />
            </EmotionItemSkeleton>
          )}
        />
      </ScreenSurface>
    )
  }

  if (todayDailyEntryError) {
    return (
      <ScreenSurface>
        <StateText>Erro ao buscar registro de hoje.</StateText>
      </ScreenSurface>
    )
  }

  if (todayDailyEntry) {
    return (
      <ScreenSurface>
        <Text variant="title">Seu registro de hoje foi:</Text>
        <EmotionItem emotion={todayDailyEntry.emotion as EmotionType}>
          <EmotionItemBadge>
            <EmotionItemIcon />
          </EmotionItemBadge>
          <EmotionItemLabel />
        </EmotionItem>
      </ScreenSurface>
    )
  }

  return (
    <ScreenSurface>
      <Text variant="title">Como foi o seu dia?</Text>
      <EmotionHorizontalList
        renderItem={(emotion) => (
          <PressableFeedback onPress={() => handleSelectEmotion(emotion)}>
            <EmotionItem emotion={emotion}>
              <EmotionItemBadge>
                <EmotionItemIcon />
              </EmotionItemBadge>
              <EmotionItemLabel />
            </EmotionItem>
          </PressableFeedback>
        )}
      />
    </ScreenSurface>
  )
}
