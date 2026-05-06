import { theme } from '@/theme'
import { EMOTION_TYPE_ENUM } from './enums'

export const EMOTION_ICONS: Record<string, string> = {
  [EMOTION_TYPE_ENUM.CALM]: '😌',
  [EMOTION_TYPE_ENUM.HAPPY]: '😀',
  [EMOTION_TYPE_ENUM.NEUTRAL]: '😐',
  [EMOTION_TYPE_ENUM.ANXIOUS]: '😟',
  [EMOTION_TYPE_ENUM.SAD]: '😢',
  [EMOTION_TYPE_ENUM.FRUSTRATED]: '😠',
}

export const EMOTION_LABELS: Record<string, string> = {
  [EMOTION_TYPE_ENUM.CALM]: 'Calmo',
  [EMOTION_TYPE_ENUM.HAPPY]: 'Feliz',
  [EMOTION_TYPE_ENUM.NEUTRAL]: 'Neutro',
  [EMOTION_TYPE_ENUM.ANXIOUS]: 'Ansioso',
  [EMOTION_TYPE_ENUM.SAD]: 'Triste',
  [EMOTION_TYPE_ENUM.FRUSTRATED]: 'Frustrado',
}

export const EMOTION_COLORS: Record<string, keyof typeof theme.colors> = {
  [EMOTION_TYPE_ENUM.CALM]: 'emotionCalm',
  [EMOTION_TYPE_ENUM.HAPPY]: 'emotionHappy',
  [EMOTION_TYPE_ENUM.NEUTRAL]: 'emotionNeutral',
  [EMOTION_TYPE_ENUM.ANXIOUS]: 'emotionAnxious',
  [EMOTION_TYPE_ENUM.SAD]: 'emotionSad',
  [EMOTION_TYPE_ENUM.FRUSTRATED]: 'emotionFrustrated',
}
