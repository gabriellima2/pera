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

type MomentEntryDetailBottomSheetProps = {
  isVisible: boolean
  onClose: () => void
  momentEntry: {
    emotion: string
    notes: string | null
    date: string | null
    situation_description: string | null
    situations: { label: string } | null
  }
}

export function MomentEntryDetailBottomSheet({
  isVisible,
  onClose,
  momentEntry,
}: MomentEntryDetailBottomSheetProps) {
  const situationText =
    momentEntry.situations?.label ?? momentEntry.situation_description

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <Box gap="xl">
        <Box alignItems="center" gap="md">
          <Box
            alignItems="center"
            justifyContent="center"
            width={80}
            height={80}
            backgroundColor={EMOTION_COLORS[momentEntry.emotion]}
            borderRadius="full"
          >
            <Text fontSize={36} lineHeight={40}>
              {EMOTION_ICONS[momentEntry.emotion]}
            </Text>
          </Box>
          <Box alignItems="center" gap="xs">
            <Text variant="title">{EMOTION_LABELS[momentEntry.emotion]}</Text>
            {momentEntry.date ? (
              <Text variant="bodyMuted">
                {formatDate(momentEntry.date, "EEEE, dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </Text>
            ) : null}
          </Box>
        </Box>

        <Box gap="sm">
          <Box
            backgroundColor="surface"
            py="md"
            pl="md"
            borderRadius="lg"
            gap="sm"
          >
            <Text variant="caption" color="foregroundSecondary">
              Situação
            </Text>
            <Text variant="bodyMuted">{situationText}</Text>
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
              {momentEntry.notes ? (
                <Text variant="bodyMuted">{momentEntry.notes}</Text>
              ) : (
                <Text variant="bodyMuted" fontStyle="italic">
                  Registro sem anotações
                </Text>
              )}
            </ScrollView>
          </Box>
        </Box>
      </Box>
    </BottomSheet>
  )
}
