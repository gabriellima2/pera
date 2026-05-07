import type { BreathingMode } from '@/@types/breathing-exercises'
import { BackButton } from '@/components/buttons/back-button'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { BREATHING_MODE_LABELS } from '@/constants/breathing-exercises'
import { BREATHING_MODE_ENUM } from '@/constants/enums'
import { theme } from '@/theme'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  CheckIcon,
  PauseIcon,
  PlayIcon,
  RefreshCcwIcon,
} from 'lucide-react-native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export function DoBreathingExercise() {
  const { mode } = useLocalSearchParams<{ mode?: BreathingMode }>()
  const router = useRouter()

  const breathingMode = mode
    ? BREATHING_MODE_OPTIONS[mode]
    : BREATHING_MODE_OPTIONS[BREATHING_MODE_ENUM.DIAPHRAGMATIC]

  const [exerciseState, setExerciseState] = useState<ExerciseState>('idle')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [countdown, setCountdown] = useState(3)

  const isPlaying = exerciseState === 'playing'
  const isDone = exerciseState === 'done'
  const isCountdown = exerciseState === 'countdown'

  const currentPhase = breathingMode.phases[phaseIndex]

  const scale = useSharedValue(INITIAL_SCALE)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const titleText = useMemo(() => {
    if (isDone) return 'Concluído!'
    if (isCountdown) return 'Prepare-se...'
    if (exerciseState === 'idle') return `Respiração ${breathingMode.label}`
    if (exerciseState === 'paused') return 'Pausado'
    return currentPhase.label
  }, [
    ,
    isDone,
    isCountdown,
    exerciseState,
    currentPhase.label,
    breathingMode.label,
  ])

  const buttonConfig = useMemo(() => {
    if (isDone) {
      return { label: 'Reiniciar', Icon: RefreshCcwIcon }
    }
    if (isPlaying) {
      return { label: 'Pausar', Icon: PauseIcon }
    }
    if (exerciseState === 'paused') {
      return { label: 'Continuar', Icon: PlayIcon }
    }
    return { label: 'Iniciar', Icon: PlayIcon }
  }, [isDone, isPlaying, exerciseState])

  const handleToggle = useCallback(() => {
    if (isDone) {
      cancelAnimation(scale)
      scale.value = INITIAL_SCALE
      setCycle(0)
      setPhaseIndex(0)
      setExerciseState('countdown')
      return
    }
    if (exerciseState === 'idle') {
      setExerciseState('countdown')
      return
    }
    if (exerciseState === 'paused') {
      setExerciseState('playing')
      return
    }
    if (isPlaying) {
      cancelAnimation(scale)
      setExerciseState('paused')
    }
  }, [isDone, isPlaying, exerciseState, scale])

  const startCountdown = useCallback(() => {
    setCountdown(3)
    let count = 3

    const interval = setInterval(() => {
      count -= 1
      if (count <= 0) {
        clearInterval(interval)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        setExerciseState('playing')
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
        setCountdown(count)
      }
    }, 1000)

    return { interval }
  }, [])

  const startExercise = useCallback(() => {
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
          setExerciseState('done')
          return
        }
        setCycle(nextCycle)
      }

      setPhaseIndex(nextIndex)
    }, phase.duration)

    return { timer }
  }, [phaseIndex, cycle, breathingMode.phases, breathingMode.cycles, scale])

  const resetScale = useCallback(() => {
    scale.value = withTiming(INITIAL_SCALE, {
      duration: 1200,
      easing: Easing.inOut(Easing.ease),
    })
  }, [scale])

  useEffect(() => {
    if (!isCountdown) return

    const { interval } = startCountdown()

    return () => clearInterval(interval)
  }, [isCountdown, startCountdown])

  useEffect(() => {
    if (!isPlaying) return

    const { timer } = startExercise()

    return () => {
      clearTimeout(timer)
      cancelAnimation(scale)
    }
  }, [isPlaying, scale, startExercise])

  useEffect(() => {
    if (!isDone) return
    resetScale()
  }, [isDone, resetScale])

  return (
    <Box flex={1} backgroundColor="background">
      <Box
        px="md"
        alignItems="flex-start"
        justifyContent="center"
        height={42}
        my="lg"
      >
        <BackButton />
      </Box>

      <Box alignItems="center" px="md" gap="xs">
        <Text variant="title" textAlign="center">
          {titleText}
        </Text>
        {!isDone && exerciseState === 'playing' && (
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
              backgroundColor: theme.colors.breathingCircle,
            },
          ]}
        />
      </Box>

      <Box
        alignItems="center"
        px="md"
        pb="md"
        minHeight={80}
        justifyContent="center"
      >
        {isCountdown && (
          <Box alignItems="center" gap="xs">
            <Text
              variant="title"
              style={{ fontSize: 64, lineHeight: 72 }}
              color="foreground"
            >
              {countdown}
            </Text>
            <Text variant="bodyMuted" textAlign="center">
              Foque na sua respiração...
            </Text>
          </Box>
        )}
        {exerciseState === 'idle' && (
          <Text variant="bodyMuted" textAlign="center">
            Encontre uma posição confortável e relaxe
          </Text>
        )}
        {exerciseState === 'paused' && (
          <Text variant="bodyMuted" textAlign="center">
            Continue quando estiver pronto
          </Text>
        )}
        {isDone && (
          <Text variant="bodyMuted" textAlign="center">
            Parabéns! Você concluiu o exercício.
          </Text>
        )}
      </Box>

      <Box px="md" pb="xl" gap="md">
        {isDone ? (
          <Box flexDirection="row" gap="md" alignItems="center">
            <Button
              variant="secondary"
              label="Reiniciar"
              iconLeft={
                <RefreshCcwIcon
                  color={theme.colors.surfaceForeground}
                  size={18}
                />
              }
              onPress={handleToggle}
            />
            <Box flex={1}>
              <Button
                label="Finalizar"
                iconLeft={
                  <CheckIcon color={theme.colors.accentForeground} size={18} />
                }
                onPress={() =>
                  router.replace('/breathing-exercises/select-breathing-mode')
                }
              />
            </Box>
          </Box>
        ) : (
          <Box alignItems="center">
            <Button
              label={buttonConfig.label}
              iconLeft={
                <buttonConfig.Icon
                  color={theme.colors.accentForeground}
                  size={18}
                />
              }
              onPress={handleToggle}
              disabled={isCountdown}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

type ExerciseState = 'idle' | 'countdown' | 'playing' | 'paused' | 'done'

type BreathingPhase = {
  label: string
  duration: number
  targetScale: number
}

type BreathingModeOption = {
  label: string
  phases: BreathingPhase[]
  cycles: number
}

const BREATHING_MODE_OPTIONS: Record<string, BreathingModeOption> = {
  [BREATHING_MODE_ENUM.DIAPHRAGMATIC]: {
    label: BREATHING_MODE_LABELS[BREATHING_MODE_ENUM.DIAPHRAGMATIC],
    phases: [
      { label: 'Inspire', duration: 4000, targetScale: 1 },
      { label: 'Expire', duration: 4000, targetScale: 0.45 },
    ],
    cycles: 6,
  },
  [BREATHING_MODE_ENUM.BOX]: {
    label: BREATHING_MODE_LABELS[BREATHING_MODE_ENUM.BOX],
    phases: [
      { label: 'Inspire', duration: 4000, targetScale: 1 },
      { label: 'Segure', duration: 4000, targetScale: 1 },
      { label: 'Expire', duration: 4000, targetScale: 0.45 },
      { label: 'Segure', duration: 4000, targetScale: 0.45 },
    ],
    cycles: 4,
  },
  [BREATHING_MODE_ENUM['478']]: {
    label: BREATHING_MODE_LABELS[BREATHING_MODE_ENUM['478']],
    phases: [
      { label: 'Inspire', duration: 4000, targetScale: 1 },
      { label: 'Segure', duration: 7000, targetScale: 1 },
      { label: 'Expire', duration: 8000, targetScale: 0.45 },
    ],
    cycles: 4,
  },
  [BREATHING_MODE_ENUM.COHERENT]: {
    label: BREATHING_MODE_LABELS[BREATHING_MODE_ENUM.COHERENT],
    phases: [
      { label: 'Inspire', duration: 5000, targetScale: 1 },
      { label: 'Expire', duration: 5000, targetScale: 0.45 },
    ],
    cycles: 5,
  },
}

const CIRCLE_SIZE = 200
const INITIAL_SCALE = 0.45
