import type { EmotionType } from '@/@types/emotions'

export const EMOTION_TYPE_ENUM: Record<
  'CALM' | 'HAPPY' | 'NEUTRAL' | 'ANXIOUS' | 'SAD' | 'FRUSTRATED',
  EmotionType
> = {
  CALM: 'calm',
  HAPPY: 'happy',
  NEUTRAL: 'neutral',
  ANXIOUS: 'anxious',
  SAD: 'sad',
  FRUSTRATED: 'frustrated',
}
