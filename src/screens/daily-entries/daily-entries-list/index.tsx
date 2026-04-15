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
import { ChevronRight, Pencil, Trash2 } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { FlatList } from 'react-native'
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

export function DailyEntriesList() {
  const { data: dailyEntries, isPending: isLoadingDailyEntries } = useQuery({
    queryFn: async () => {
      const dailyEntries = await supabaseClient
        .from('daily_entries')
        .select('id, date, emotion, notes')
        .order('date', { ascending: false })

      if (dailyEntries.error) {
        throw new Error('Erro ao buscar registros diários')
      }

      return dailyEntries.data
    },
    queryKey: QUERY_KEYS.DAILY_ENTRIES.ALL,
    throwOnError: true,
  })

  return (
    <FlatList
      data={dailyEntries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
      }}
      ListHeaderComponent={() => (
        <Box
          gap="md"
          flexDirection="row"
          alignItems="center"
          height={42}
          my="lg"
        >
          <BackButton />
          <Text variant="title">Registros diários</Text>
        </Box>
      )}
      renderItem={({ item }) => <DailyEntriesListItem item={item} />}
      ListEmptyComponent={
        isLoadingDailyEntries ? (
          <EmotionListSkeleton />
        ) : (
          <Box py="xl" alignItems="center">
            <Text color="foregroundSecondary">Nenhum registro encontrado.</Text>
          </Box>
        )
      }
    />
  )
}

type DailyEntry = {
  id: string
  date: string
  emotion: string
  notes: string | null
}

function DailyEntriesListItem({ item }: { item: DailyEntry }) {
  const router = useRouter()
  const swipeableRef = useRef<SwipeableMethods>(null)
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null)

  return (
    <>
      <ReanimatedSwipeable
        ref={swipeableRef}
        containerStyle={{ marginBottom: theme.spacing.sm }}
        overshootLeft={false}
        overshootRight={false}
        renderLeftActions={() => (
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
        )}
        renderRightActions={() => (
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
        )}
        onSwipeableOpen={(direction) => {
          swipeableRef.current?.close()
          if (direction === 'right') {
            router.push({
              pathname: '/edit-daily-entry/[id]',
              params: { id: item.id },
            })
          } else {
            setSelectedDeleteId(item.id)
          }
        }}
      >
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

          <ChevronRight size={16} color={theme.colors.foregroundSecondary} />
        </Box>
      </ReanimatedSwipeable>
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
