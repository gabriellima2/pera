import type { BreathingMode } from '@/@types/breathing-exercises'
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

export const BREATHING_MODE_ENUM: Record<
  'DIAPHRAGMATIC' | 'BOX' | '478' | 'COHERENT',
  BreathingMode
> = {
  DIAPHRAGMATIC: 'diaphragmatic',
  BOX: 'box',
  '478': '478',
  COHERENT: 'coherent',
}
