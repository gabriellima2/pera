import type { BreathingMode } from '@/@types/breathing-exercises'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { BREATHING_MODE_ENUM } from '@/constants/enums'
import { theme } from '@/theme'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams } from 'expo-router'
import { PauseIcon, PlayIcon, RefreshCcwIcon } from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export function DoBreathingExercise() {
  const { mode } = useLocalSearchParams<{ mode?: BreathingMode }>()

  const breathingMode = mode
    ? BREATHING_MODE_OPTIONS[mode]
    : BREATHING_MODE_OPTIONS[BREATHING_MODE_ENUM.DIAPHRAGMATIC]

  const [isPlaying, setIsPlaying] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [isDone, setIsDone] = useState(false)

  const scale = useSharedValue(INITIAL_SCALE)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  useEffect(() => {
    if (!isPlaying) return

    const phase = breathingMode.phases[phaseIndex]

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    scale.value = withTiming(phase.targetScale, {
      duration: phase.duration,
      easing: Easing.inOut(Easing.ease),
    })

    const timer = setTimeout(() => {
      const nextIndex = (phaseIndex + 1) % breathingMode.phases.length

      if (nextIndex === 0) {
        const nextCycle = cycle + 1
        if (nextCycle >= breathingMode.cycles) {
          setIsPlaying(false)
          setIsDone(true)
          return
        }
        setCycle(nextCycle)
      }

      setPhaseIndex(nextIndex)
    }, phase.duration)

    return () => {
      clearTimeout(timer)
      cancelAnimation(scale)
    }
  }, [
    isPlaying,
    phaseIndex,
    cycle,
    breathingMode.phases,
    breathingMode.cycles,
    scale,
  ])

  const handleToggle = useCallback(() => {
    if (isDone) {
      cancelAnimation(scale)
      scale.value = INITIAL_SCALE
      setIsDone(false)
      setCycle(0)
      setPhaseIndex(0)
      setIsPlaying(true)
      return
    }
    if (isPlaying) {
      cancelAnimation(scale)
    }
    setIsPlaying((prev) => !prev)
  }, [isDone, isPlaying, scale])

  const currentPhase = breathingMode.phases[phaseIndex]

  return (
    <Box flex={1} backgroundColor="background">
      <Box alignItems="center" pt="xxl" px="md" gap="sm">
        <Text variant="title" textAlign="center">
          {isDone ? 'Concluído!' : currentPhase.label}
        </Text>
        {!isDone && (
          <Text variant="bodyMuted">
            Ciclo {cycle + 1} de {breathingMode.cycles}
          </Text>
        )}
      </Box>

      <Box flex={1} alignItems="center" justifyContent="center">
        <Animated.View
          style={[
            animatedStyle,
            {
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              backgroundColor: '#6CB8F0',
            },
          ]}
        />
      </Box>

      <Box
        alignItems="center"
        px="md"
        pb="xl"
        flexDirection="row"
        gap="md"
        justifyContent="center"
      >
        <Button width={64} onPress={handleToggle}>
          {isPlaying ? (
            <PauseIcon color={theme.colors.accentForeground} />
          ) : isDone ? (
            <RefreshCcwIcon color={theme.colors.accentForeground} />
          ) : (
            <PlayIcon color={theme.colors.accentForeground} />
          )}
        </Button>
      </Box>
    </Box>
  )
}

type BreathingPhase = {
  label: string
  duration: number
  targetScale: number
}

type BreathingModeOption = {
  phases: BreathingPhase[]
  cycles: number
}

const BREATHING_MODE_OPTIONS: Record<string, BreathingModeOption> = {
  [BREATHING_MODE_ENUM.DIAPHRAGMATIC]: {
    phases: [
      { label: 'Inspire', duration: 4000, targetScale: 1 },
      { label: 'Expire', duration: 4000, targetScale: 0.45 },
    ],
    cycles: 6,
  },
  [BREATHING_MODE_ENUM.BOX]: {
    phases: [
      { label: 'Inspire', duration: 4000, targetScale: 1 },
      { label: 'Segure', duration: 4000, targetScale: 1 },
      { label: 'Expire', duration: 4000, targetScale: 0.45 },
      { label: 'Segure', duration: 4000, targetScale: 0.45 },
    ],
    cycles: 4,
  },
  [BREATHING_MODE_ENUM['478']]: {
    phases: [
      { label: 'Inspire', duration: 4000, targetScale: 1 },
      { label: 'Segure', duration: 7000, targetScale: 1 },
      { label: 'Expire', duration: 8000, targetScale: 0.45 },
    ],
    cycles: 4,
  },
  [BREATHING_MODE_ENUM.COHERENT]: {
    phases: [
      { label: 'Inspire', duration: 5000, targetScale: 1 },
      { label: 'Expire', duration: 5000, targetScale: 0.45 },
    ],
    cycles: 5,
  },
}

const CIRCLE_SIZE = 200
const INITIAL_SCALE = 0.45
