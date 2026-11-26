import { DailyEntryDetailBottomSheet } from '@/components/bottom-sheets/daily-entry-detail-bottom-sheet'
import { DeleteDailyEntryBottomSheet } from '@/components/bottom-sheets/delete-daily-entry-bottom-sheet'
import { Box } from '@/components/ui/box'
import { PressableFeedback } from '@/components/ui/pressable-feedback'
import { Text } from '@/components/ui/text'
import { EMOTION_COLORS, EMOTION_ICONS } from '@/constants/emotions'
import { theme } from '@/theme'
import { formatDate } from 'date-fns'
import { useRouter } from 'expo-router'
import { Pencil, Trash2 } from 'lucide-react-native'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

export type DailyEntry = {
  id: string
  date: string
  emotion: string
  notes: string | null
}

type DailyEntryCardContextValue = {
  openDetail: (entry: DailyEntry) => void
  openConfirmDelete: (dailyEntryId: string) => void
}

const DailyEntryCardContext = createContext<DailyEntryCardContextValue | null>(
  null,
)

function useDailyEntryCard() {
  const context = useContext(DailyEntryCardContext)
  if (!context) {
    throw new Error('DailyEntryCard must be used within DailyEntryCardProvider')
  }
  return context
}

export function DailyEntryCardProvider({ children }: React.PropsWithChildren) {
  const [detailEntry, setDetailEntry] = useState<DailyEntry | null>(null)
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null)

  const value = useMemo<DailyEntryCardContextValue>(
    () => ({
      openDetail: setDetailEntry,
      openConfirmDelete: setDeleteEntryId,
    }),
    [],
  )

  return (
    <DailyEntryCardContext.Provider value={value}>
      {children}
      {detailEntry && (
        <DailyEntryDetailBottomSheet
          isVisible={detailEntry !== null}
          dailyEntry={detailEntry}
          onClose={() => setDetailEntry(null)}
        />
      )}
      {deleteEntryId && (
        <DeleteDailyEntryBottomSheet
          isVisible={deleteEntryId !== null}
          dailyEntryId={deleteEntryId}
          onClose={() => setDeleteEntryId(null)}
        />
      )}
    </DailyEntryCardContext.Provider>
  )
}

type DailyEntryCardProps = {
  dailyEntry: DailyEntry
}

export function DailyEntryCard({ dailyEntry }: DailyEntryCardProps) {
  const { openDetail, openConfirmDelete } = useDailyEntryCard()
  const swipeableRef = useRef<SwipeableMethods>(null)
  const router = useRouter()

  const handleEditDailyEntry = useCallback(() => {
    router.push({
      pathname: '/edit-daily-entry/[id]',
      params: { id: dailyEntry.id },
    })
  }, [router, dailyEntry.id])

  const handleDeleteDailyEntry = useCallback(() => {
    openConfirmDelete(dailyEntry.id)
  }, [dailyEntry.id, openConfirmDelete])

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
    <ReanimatedSwipeable
      ref={swipeableRef}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableOpen={handleSwipeableOpen}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
    >
      <PressableFeedback onPress={() => openDetail(dailyEntry)}>
        <Box
          backgroundColor="surface"
          p="md"
          borderRadius="lg"
          flexDirection="row"
          alignItems="center"
          gap="md"
        >
          <Box
            backgroundColor={EMOTION_COLORS[dailyEntry.emotion]}
            width={40}
            height={40}
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
          >
            <Text fontSize={20} lineHeight={24}>
              {EMOTION_ICONS[dailyEntry.emotion]}
            </Text>
          </Box>

          <Box flex={1} gap="xs">
            <Text variant="bodyMuted">
              {formatDate(dailyEntry.date, 'dd/MM/yyyy')}
            </Text>
            {dailyEntry.notes ? (
              <Text variant="caption" numberOfLines={1}>
                {dailyEntry.notes}
              </Text>
            ) : (
              <Text variant="caption" fontStyle="italic">
                Registro sem anotações
              </Text>
            )}
          </Box>
        </Box>
      </PressableFeedback>
    </ReanimatedSwipeable>
  )
}
