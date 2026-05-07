import type { BreathingMode } from '@/@types/breathing-exercises'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { BREATHING_MODE_LABELS } from '@/constants/breathing-exercises'
import { BREATHING_MODE_ENUM } from '@/constants/enums'
import { PADDING_BOTTOM_FORM_FOOTER_HEIGHT } from '@/constants/styles'
import { theme } from '@/theme'
import { Link } from 'expo-router'
import { ChevronRightIcon } from 'lucide-react-native'
import { ScrollView } from 'react-native'

export function SelectBreathingMode() {
  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: PADDING_BOTTOM_FORM_FOOTER_HEIGHT,
        }}
      >
        <Box px="md" justifyContent="center" height={42} my="lg">
          <Text variant="title">Escolha uma técnica para começar</Text>
        </Box>

        <Box px="md" gap="sm">
          {MODE_OPTIONS.map((option) => (
            <Link
              key={option.mode}
              href={{
                pathname: '/breathing-exercises/do-breathing-exercise',
                params: { mode: option.mode },
              }}
            >
              <Box
                backgroundColor="surface"
                px="md"
                py="lg"
                borderRadius="lg"
                flexDirection="row"
                alignItems="center"
                gap="md"
              >
                <Box flex={1} gap="xs">
                  <Text variant="subtitle">{option.label}</Text>
                  <Text>{option.description}</Text>
                  <Text variant="caption">{option.detail}</Text>
                </Box>
                <ChevronRightIcon
                  size={16}
                  color={theme.colors.foregroundSecondary}
                />
              </Box>
            </Link>
          ))}
        </Box>
      </ScrollView>
    </Box>
  )
}

type ModeOption = {
  mode: BreathingMode
  label: string
  description: string
  detail: string
}

const MODE_OPTIONS: ModeOption[] = [
  {
    mode: BREATHING_MODE_ENUM.DIAPHRAGMATIC,
    label: BREATHING_MODE_LABELS[BREATHING_MODE_ENUM.DIAPHRAGMATIC],
    description: 'Respiração lenta e profunda pelo diafragma.',
    detail: '4s inspira · 4s expira · 6 ciclos',
  },
  {
    mode: BREATHING_MODE_ENUM.BOX,
    label: BREATHING_MODE_LABELS[BREATHING_MODE_ENUM.BOX],
    description: 'Quatro fases iguais para acalmar o sistema nervoso.',
    detail: '4s × 4 fases · 4 ciclos',
  },
  {
    mode: BREATHING_MODE_ENUM['478'],
    label: BREATHING_MODE_LABELS[BREATHING_MODE_ENUM['478']],
    description: 'Técnica relaxante indicada para ansiedade e sono.',
    detail: '4s · 7s · 8s · 4 ciclos',
  },
  {
    mode: BREATHING_MODE_ENUM.COHERENT,
    label: BREATHING_MODE_LABELS[BREATHING_MODE_ENUM.COHERENT],
    description:
      'Cinco segundos em cada fase para equilibrar o ritmo cardíaco.',
    detail: '5s inspira · 5s expira · 5 ciclos',
  },
]
