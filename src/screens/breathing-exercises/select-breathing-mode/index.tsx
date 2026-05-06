import type { BreathingMode } from '@/@types/breathing-exercises'
import { BackButton } from '@/components/buttons/back-button'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { BREATHING_MODE_LABELS } from '@/constants/breathing-exercises'
import { BREATHING_MODE_ENUM } from '@/constants/enums'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'

export function SelectBreathingMode() {
  const router = useRouter()
  const [selected, setSelected] = useState<BreathingMode>(
    BREATHING_MODE_ENUM.DIAPHRAGMATIC,
  )

  function handleAdvance() {
    router.push({
      pathname: '/(private)/breathing-exercises/do-breathing-exercise',
      params: { mode: selected },
    })
  }

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Box px="md" mt="lg" gap="sm">
          <Box flexDirection="row" alignItems="center" gap="md" height={42}>
            <BackButton />
            <Text variant="title">Exercício de respiração</Text>
          </Box>

          <Text variant="bodyMuted" mt="sm">
            Escolha uma técnica para começar
          </Text>
        </Box>

        <Box px="md" mt="lg" gap="sm">
          {MODE_OPTIONS.map((option) => {
            const isSelected = selected === option.mode
            return (
              <TouchableOpacity
                key={option.mode}
                activeOpacity={0.7}
                onPress={() => setSelected(option.mode)}
              >
                <Box
                  borderRadius="md"
                  borderWidth={1.5}
                  borderColor={isSelected ? 'accent' : 'border'}
                  backgroundColor={isSelected ? 'accentSoft' : 'surface'}
                  px="md"
                  py="md"
                  gap="xs"
                >
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text variant="subtitle">{option.label}</Text>
                    {isSelected && (
                      <Box
                        width={10}
                        height={10}
                        borderRadius="full"
                        backgroundColor="accent"
                      />
                    )}
                  </Box>
                  <Text variant="body">{option.description}</Text>
                  <Text variant="caption">{option.detail}</Text>
                </Box>
              </TouchableOpacity>
            )
          })}
        </Box>
      </ScrollView>

      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        px="md"
        pb="lg"
        backgroundColor="background"
      >
        <Button label="Começar" onPress={handleAdvance} />
      </Box>
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
