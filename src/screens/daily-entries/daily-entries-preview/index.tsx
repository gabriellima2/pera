import type { EmotionType } from '@/@types/emotions'
import { DailyEntryDetailBottomSheet } from '@/components/bottom-sheets/daily-entry-detail-bottom-sheet'
import { DeleteDailyEntryBottomSheet } from '@/components/bottom-sheets/delete-daily-entry-bottom-sheet'
import { Box } from '@/components/ui/box'
import { EmotionListSkeleton, Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import {
  EMOTION_COLORS,
  EMOTION_ICONS,
  EMOTION_LABELS,
} from '@/constants/emotions'
import { EMOTION_TYPE_ENUM } from '@/constants/enums'
import { QUERY_KEYS } from '@/constants/keys'
import { PADDING_BOTTOM_TAB_BAR_HEIGHT } from '@/constants/styles'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { getCurrentDateString } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'
import { formatDate } from 'date-fns'
import { Link, useRouter } from 'expo-router'
import { Pencil, Trash2 } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
import { Pressable, ScrollView } from 'react-native'
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

const EMOTIONS: EmotionType[] = Object.values(EMOTION_TYPE_ENUM)

type DailyEntryItem = {
  id: string
  date: string
  emotion: string
  notes: string | null
}

export function DailyEntriesPreview() {
  const router = useRouter()

  const {
    data: todayDailyEntry,
    error: todayDailyEntryError,
    isPending: isLoadingTodayDailyEntry,
  } = useQuery({
    queryFn: async () => {
      const dailyEntry = await supabaseClient
        .from('daily_entries')
        .select('id, emotion')
        .eq('date', getCurrentDateString())
        .is('deleted_at', null)

      if (dailyEntry.error) {
        console.error(dailyEntry.error)
        throw new Error('Erro ao buscar registro diário do dia atual')
      }

      return dailyEntry.data?.[0] || null
    },
    retry: false,
    queryKey: QUERY_KEYS.DAILY_ENTRIES.TODAY,
  })

  const {
    data: lastDailyEntries,
    error: lastDailyEntriesError,
    isPending: isLoadingLastDailyEntries,
  } = useQuery({
    queryFn: async () => {
      const dailyEntries = await supabaseClient
        .from('daily_entries')
        .select('id, date, emotion, notes')
        .order('date', { ascending: false })
        .is('deleted_at', null)
        .limit(8)

      if (dailyEntries.error) {
        console.error(dailyEntries.error)
        throw new Error('Erro ao buscar registros diários')
      }

      return dailyEntries.data || []
    },
    retry: false,
    queryKey: QUERY_KEYS.DAILY_ENTRIES.PREVIEW,
  })

  const handleSelectEmotion = (emotion: EmotionType) => {
    router.push({
      pathname: '/create-daily-entry',
      params: { emotion },
    })
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: PADDING_BOTTOM_TAB_BAR_HEIGHT,
      }}
    >
      {isLoadingTodayDailyEntry ? (
        <Box
          backgroundColor="surface"
          py="lg"
          gap="lg"
          mb="lg"
          borderBottomLeftRadius="lg"
          borderBottomRightRadius="lg"
        >
          <Skeleton
            width={200}
            height={24}
            backgroundColor="background"
            ml="md"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: theme.spacing.md,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            {EMOTIONS.map((emotion) => (
              <Box key={emotion} alignItems="center" gap="sm">
                <Skeleton
                  width={60}
                  height={60}
                  borderRadius="full"
                  backgroundColor="background"
                />
                <Skeleton width={50} height={16} backgroundColor="background" />
              </Box>
            ))}
          </ScrollView>
        </Box>
      ) : todayDailyEntryError ? (
        <Box
          alignItems="center"
          backgroundColor="surface"
          px="md"
          py="lg"
          borderBottomLeftRadius="lg"
          borderBottomRightRadius="lg"
          gap="lg"
          mb="lg"
        >
          <Text color="foregroundSecondary">
            Erro ao buscar registro de hoje.
          </Text>
        </Box>
      ) : todayDailyEntry ? (
        <Box
          alignItems="center"
          backgroundColor="surface"
          px="md"
          pt="md"
          pb="lg"
          borderBottomLeftRadius="lg"
          borderBottomRightRadius="lg"
          gap="lg"
          mb="lg"
        >
          <Text variant="title">Seu registro de hoje foi:</Text>
          <Box alignItems="center" gap="sm">
            <Box
              alignItems="center"
              justifyContent="center"
              gap="xs"
              width={60}
              height={60}
              backgroundColor={EMOTION_COLORS[todayDailyEntry.emotion]}
              borderRadius="full"
            >
              <Text fontSize={28} lineHeight={32}>
                {EMOTION_ICONS[todayDailyEntry.emotion]}
              </Text>
            </Box>
            <Text variant="caption">
              {EMOTION_LABELS[todayDailyEntry.emotion]}
            </Text>
          </Box>
        </Box>
      ) : (
        <Box
          backgroundColor="surface"
          py="lg"
          gap="lg"
          mb="lg"
          borderBottomLeftRadius="lg"
          borderBottomRightRadius="lg"
        >
          <Text variant="title" pl="md">
            Como foi o seu dia?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: theme.spacing.md,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            {EMOTIONS.map((emotion) => (
              <Pressable
                key={emotion}
                onPress={() => handleSelectEmotion(emotion)}
              >
                <Box alignItems="center" gap="sm">
                  <Box
                    backgroundColor={EMOTION_COLORS[emotion]}
                    borderRadius="full"
                    width={60}
                    height={60}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={28} lineHeight={32}>
                      {EMOTION_ICONS[emotion]}
                    </Text>
                  </Box>
                  <Text variant="caption">{EMOTION_LABELS[emotion]}</Text>
                </Box>
              </Pressable>
            ))}
          </ScrollView>
        </Box>
      )}

      <Box flex={1} px="md" gap="md" backgroundColor="background">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text variant="subtitle">
            Últimos {LAST_DAILY_ENTRIES_PREVIEW_COUNT} registros
          </Text>
          {lastDailyEntries &&
            lastDailyEntries.length > LAST_DAILY_ENTRIES_PREVIEW_COUNT && (
              <Link href="/(private)/(tabs)/(daily-entries)/daily-entries-list">
                <Text color="accent" variant="caption">
                  Ver todos
                </Text>
              </Link>
            )}
        </Box>

        <Box>
          {isLoadingLastDailyEntries ? (
            <EmotionListSkeleton />
          ) : lastDailyEntriesError ? (
            <Box py="xl" alignItems="center">
              <Text color="foregroundSecondary">
                Erro ao buscar registros diários.
              </Text>
            </Box>
          ) : lastDailyEntries && lastDailyEntries.length > 0 ? (
            lastDailyEntries?.map((dailyEntry) => (
              <DailyEntryPreviewItem key={dailyEntry.id} item={dailyEntry} />
            ))
          ) : (
            <Box py="xl" alignItems="center">
              <Text color="foregroundSecondary">
                Nenhum registro encontrado.
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </ScrollView>
  )
}

const LAST_DAILY_ENTRIES_PREVIEW_COUNT = 7

type DailyEntryPreviewItemProps = {
  item: DailyEntryItem
}

function DailyEntryPreviewItem({ item }: DailyEntryPreviewItemProps) {
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null)
  const [selectedDetailEntry, setSelectedDetailEntry] =
    useState<DailyEntryItem | null>(null)
  const swipeableRef = useRef<SwipeableMethods>(null)

  const router = useRouter()

  const handleEditDailyEntry = useCallback(() => {
    router.push({
      pathname: '/edit-daily-entry/[id]',
      params: { id: item.id },
    })
  }, [router, item.id])

  const handleDeleteDailyEntry = useCallback(() => {
    setSelectedDeleteId(item.id)
  }, [item.id])

  const handleSwipeableOpen = useCallback(
    (direction: 'left' | 'right') => {
      swipeableRef.current?.close()
      if (direction === 'right') {
        handleEditDailyEntry()
      } else if (direction === 'left') {
        handleDeleteDailyEntry()
      }
    },
    [handleEditDailyEntry, handleDeleteDailyEntry],
  )

  const renderLeftActions = useCallback(() => {
    return (
      <Box
        width={80}
        backgroundColor="editSwipe"
        alignItems="center"
        justifyContent="center"
        borderTopLeftRadius="lg"
        borderBottomLeftRadius="lg"
      >
        <Pencil size={24} color={theme.colors.editSwipeForeground} />
      </Box>
    )
  }, [])

  const renderRightActions = useCallback(() => {
    return (
      <Box
        width={80}
        backgroundColor="deleteSwipe"
        alignItems="center"
        justifyContent="center"
        borderTopRightRadius="lg"
        borderBottomRightRadius="lg"
      >
        <Trash2 size={24} color={theme.colors.deleteSwipeForeground} />
      </Box>
    )
  }, [])

  return (
    <>
      <ReanimatedSwipeable
        ref={swipeableRef}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableOpen={handleSwipeableOpen}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        containerStyle={{ marginBottom: theme.spacing.sm }}
      >
        <Pressable onPress={() => setSelectedDetailEntry(item)}>
          <Box
            backgroundColor="surface"
            p="md"
            borderRadius="lg"
            flexDirection="row"
            alignItems="center"
            gap="md"
          >
            <Box
              backgroundColor={EMOTION_COLORS[item.emotion]}
              width={40}
              height={40}
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
            >
              <Text fontSize={20} lineHeight={24}>
                {EMOTION_ICONS[item.emotion]}
              </Text>
            </Box>

            <Box flex={1} gap="xs">
              <Text variant="bodyMuted">
                {formatDate(item.date, 'dd/MM/yyyy')}
              </Text>
              {item.notes ? (
                <Text variant="caption" numberOfLines={1}>
                  {item.notes}
                </Text>
              ) : (
                <Text variant="caption" fontStyle="italic">
                  Registro sem anotações
                </Text>
              )}
            </Box>
          </Box>
        </Pressable>
      </ReanimatedSwipeable>
      {selectedDetailEntry && (
        <DailyEntryDetailBottomSheet
          isVisible={selectedDetailEntry !== null}
          dailyEntry={selectedDetailEntry}
          onClose={() => setSelectedDetailEntry(null)}
        />
      )}
      {selectedDeleteId && (
        <DeleteDailyEntryBottomSheet
          isVisible={selectedDeleteId !== null}
          dailyEntryId={selectedDeleteId}
          onClose={() => setSelectedDeleteId(null)}
        />
      )}
    </>
  )
}
