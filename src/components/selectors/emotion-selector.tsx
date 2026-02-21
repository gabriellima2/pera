import type { EmotionType } from '@/@types/emotions'
import { EMOTION_ICONS, EMOTION_LABELS } from '@/constants/emotions'
import { EMOTION_TYPE_ENUM } from '@/constants/enums'
import { Pressable } from 'react-native'
import { Box } from '../ui/box'
import { Text } from '../ui/text'

const EMOTIONS: EmotionType[] = Object.values(EMOTION_TYPE_ENUM)

type EmotionSelectorProps = {
  id?: string
  value: string
  onSelect: (emotion: string) => void
}

export function EmotionSelector({ id, value, onSelect }: EmotionSelectorProps) {
  return (
    <Box aria-labelledby={id} flexDirection="row" flexWrap="wrap" gap="sm">
      {EMOTIONS.map((emotion) => {
        const isSelected = value === emotion
        return (
          <Pressable
            key={emotion}
            onPress={() => onSelect(emotion)}
            style={{
              flex: 1,
              minWidth: 100,
            }}
          >
            <Box
              aspectRatio={1}
              borderRadius="lg"
              alignItems="center"
              justifyContent="center"
              gap="sm"
              borderWidth={1}
              borderColor={isSelected ? 'accent' : 'border'}
              backgroundColor={isSelected ? 'accentSoft' : 'surface'}
            >
              <Text fontSize={28} lineHeight={32}>
                {EMOTION_ICONS[emotion]}
              </Text>
              <Text variant="caption">{EMOTION_LABELS[emotion]}</Text>
            </Box>
          </Pressable>
        )
      })}
    </Box>
  )
}
