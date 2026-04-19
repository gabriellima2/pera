import { DeleteMomentEntryBottomSheet } from '@/components/bottom-sheets/delete-moment-entry-bottom-sheet'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { EmotionListSkeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { EMOTION_COLORS, EMOTION_ICONS } from '@/constants/emotions'
import { QUERY_KEYS } from '@/constants/keys'
import { PADDING_BOTTOM_TAB_BAR_HEIGHT } from '@/constants/styles'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouter } from 'expo-router'
import { ChevronRight, Pencil, PlusIcon, Trash2 } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

type MomentEntry = {
  id: string
  emotion: string
  notes: string | null
  situation_description: string | null
  situations: { id: string; label: string; code: string } | null
}

export function MomentEntriesList() {
  const { data: momentEntries, isPending: isLoadingMomentEntries } = useQuery({
    queryFn: async () => {
      const momentEntries = await supabaseClient
        .from('moment_entries')
        .select(
          'id, situation_description, emotion, notes, situations ( id, label, code )',
        )
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (momentEntries.error) {
        throw new Error('Erro ao buscar registros de momentos')
      }

      return momentEntries.data
    },
    queryKey: QUERY_KEYS.MOMENT_ENTRIES.ALL,
    throwOnError: true,
  })

  const keyExtractor = useCallback((item: MomentEntry) => item.id, [])

  const renderItem = useCallback(({ item }: { item: MomentEntry }) => {
    return <MomentEntriesListItem item={item} />
  }, [])

  const renderListHeaderComponent = useCallback(() => {
    return (
      <Box
        gap="md"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        height={42}
        my="lg"
      >
        <Text variant="title">Momentos</Text>
        <Link
          href="/(private)/(tabs)/(moment-entries)/create-moment-entry"
          asChild
        >
          <Button size="sm" variant="secondary">
            <PlusIcon />
          </Button>
        </Link>
      </Box>
    )
  }, [])

  const renderListEmptyComponent = useCallback(() => {
    if (isLoadingMomentEntries) {
      return <EmotionListSkeleton />
    }

    return (
      <Box py="xl" alignItems="center">
        <Text color="foregroundSecondary">Nenhum registro encontrado.</Text>
      </Box>
    )
  }, [isLoadingMomentEntries])

  return (
    <FlatList
      data={momentEntries}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={renderListHeaderComponent}
      ListEmptyComponent={renderListEmptyComponent}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.md,
        paddingBottom: PADDING_BOTTOM_TAB_BAR_HEIGHT,
      }}
    />
  )
}

type MomentEntriesListItemProps = {
  item: MomentEntry
}

function MomentEntriesListItem({ item }: MomentEntriesListItemProps) {
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null)
  const swipeableRef = useRef<SwipeableMethods>(null)

  const router = useRouter()

  const handleEditMomentEntry = useCallback(() => {
    router.push({
      pathname: '/edit-moment-entry/[id]',
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
            {item.situations?.label ? (
              <Text>{item.situations?.label}</Text>
            ) : item.situation_description ? (
              <Text numberOfLines={1}>{item.situation_description}</Text>
            ) : null}
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
        <DeleteMomentEntryBottomSheet
          isVisible={selectedDeleteId !== null}
          momentEntryId={selectedDeleteId}
          onClose={() => setSelectedDeleteId(null)}
        />
      )}
    </>
  )
}
