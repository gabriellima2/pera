import { DailyEntryDetailBottomSheet } from '@/components/bottom-sheets/daily-entry-detail-bottom-sheet'
import { DeleteDailyEntryBottomSheet } from '@/components/bottom-sheets/delete-daily-entry-bottom-sheet'
import { BackButton } from '@/components/buttons/back-button'
import { Box } from '@/components/ui/box'
import { EmotionListSkeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { EMOTION_COLORS, EMOTION_ICONS } from '@/constants/emotions'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useQuery } from '@tanstack/react-query'
import { formatDate } from 'date-fns'
import { useRouter } from 'expo-router'
import { Pencil, Trash2 } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
import { FlatList, Pressable } from 'react-native'
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

type DailyEntry = {
  id: string
  date: string
  emotion: string
  notes: string | null
}

export function DailyEntriesList() {
  const { data: dailyEntries, isPending: isLoadingDailyEntries } = useQuery({
    queryFn: async () => {
      const dailyEntries = await supabaseClient
        .from('daily_entries')
        .select('id, date, emotion, notes')
        .order('date', { ascending: false })
        .is('deleted_at', null)

      if (dailyEntries.error) {
        throw new Error('Erro ao buscar registros diários')
      }

      return dailyEntries.data
    },
    queryKey: QUERY_KEYS.DAILY_ENTRIES.ALL,
    throwOnError: true,
  })

  const keyExtractor = useCallback((item: DailyEntry) => item.id, [])

  const renderItem = useCallback(({ item }: { item: DailyEntry }) => {
    return <DailyEntriesListItem item={item} />
  }, [])

  const renderListHeaderComponent = useCallback(() => {
    return (
      <Box gap="md" flexDirection="row" alignItems="center" height={42} my="lg">
        <BackButton />
        <Text variant="title">Registros diários</Text>
      </Box>
    )
  }, [])

  const renderListEmptyComponent = useCallback(() => {
    if (isLoadingDailyEntries) {
      return <EmotionListSkeleton />
    }

    return (
      <Box py="xl" alignItems="center">
        <Text color="foregroundSecondary">Nenhum registro encontrado.</Text>
      </Box>
    )
  }, [isLoadingDailyEntries])

  return (
    <FlatList
      data={dailyEntries}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={renderListHeaderComponent}
      ListEmptyComponent={renderListEmptyComponent}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
      }}
    />
  )
}

type DailyEntriesListItemProps = {
  item: DailyEntry
}

function DailyEntriesListItem({ item }: DailyEntriesListItemProps) {
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null)
  const [selectedDetailEntry, setSelectedDetailEntry] =
    useState<DailyEntry | null>(null)
  const swipeableRef = useRef<SwipeableMethods>(null)

  const router = useRouter()

  const handleEditMomentEntry = useCallback(() => {
    router.push({
      pathname: '/edit-daily-entry/[id]',
      params: { id: item.id },
    })
  }, [router, item.id])

  const handleDeleteMomentEntry = useCallback(() => {
    setSelectedDeleteId(item.id)
  }, [item.id])

  const handleSwipeableOpen = useCallback(
    (direction: 'left' | 'right') => {
      swipeableRef.current?.close()
      if (direction === 'right') {
        handleEditMomentEntry()
      } else if (direction === 'left') {
        handleDeleteMomentEntry()
      }
    },
    [handleEditMomentEntry, handleDeleteMomentEntry],
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
