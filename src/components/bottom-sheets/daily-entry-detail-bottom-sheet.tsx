import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import {
  EMOTION_COLORS,
  EMOTION_ICONS,
  EMOTION_LABELS,
} from '@/constants/emotions'
import { theme } from '@/theme'
import { formatDate } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ScrollView } from 'react-native-gesture-handler'

type DailyEntryDetailBottomSheetProps = {
  isVisible: boolean
  onClose: () => void
  dailyEntry: {
    date: string
    emotion: string
    notes: string | null
  }
}

export function DailyEntryDetailBottomSheet({
  isVisible,
  onClose,
  dailyEntry,
}: DailyEntryDetailBottomSheetProps) {
  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <Box gap="xl">
        <Box alignItems="center" gap="md">
          <Box
            alignItems="center"
            justifyContent="center"
            width={80}
            height={80}
            backgroundColor={EMOTION_COLORS[dailyEntry.emotion]}
            borderRadius="full"
          >
            <Text fontSize={36} lineHeight={40}>
              {EMOTION_ICONS[dailyEntry.emotion]}
            </Text>
          </Box>
          <Box alignItems="center" gap="xs">
            <Text variant="title">{EMOTION_LABELS[dailyEntry.emotion]}</Text>
            <Text variant="bodyMuted">
              {formatDate(dailyEntry.date, "EEEE, dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </Text>
          </Box>
        </Box>

        <Box
          backgroundColor="surface"
          py="md"
          pl="md"
          borderRadius="lg"
          gap="sm"
        >
          <Text variant="caption" color="foregroundSecondary">
            Anotações
          </Text>
          <ScrollView
            style={{ maxHeight: 160, paddingRight: theme.spacing.md }}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            {dailyEntry.notes ? (
              <Text variant="bodyMuted">{dailyEntry.notes}</Text>
            ) : (
              <Text variant="bodyMuted" fontStyle="italic">
                Registro sem anotações
              </Text>
            )}
          </ScrollView>
        </Box>
      </Box>
    </BottomSheet>
  )
}
